using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Utils;
using Backend.DTO.User.Accounting;
using Backend.DTO.Payment;
using Backend.Responses.Payment;
using Backend.Models.Order;
using Stripe.Checkout;
using Microsoft.Extensions.Configuration;

namespace Backend.Services.User
{
    public class AccountingService
    {
        private readonly DBContextModel db;
        private readonly IConfiguration configuration;

        public AccountingService
        (
            DBContextModel _db,
            IConfiguration _configuration
        )
        {
            db = _db;
            configuration = _configuration;
            Stripe.StripeConfiguration.ApiKey = configuration["Stripe:SecretKey"];
        }

        public async Task<ServiceResult<CheckoutResponse>> Pay(PayDTO dTO, string Id)
        {
            if (dTO == null || string.IsNullOrWhiteSpace(dTO.CourceId))
            {
                return ServiceResult<CheckoutResponse>
                       .Fail("Course id is required", 400);
            }

            var user = await db.Users.FirstOrDefaultAsync(u => u.Id == Id);

            if (user == null)
            {
                return ServiceResult<CheckoutResponse>
                       .Fail("User not found with this id", 404);
            }

            if (user.EnrolledCourcesId != null && user.EnrolledCourcesId.Contains(dTO.CourceId))
            {
                return ServiceResult<CheckoutResponse>
                       .Fail("You are already enrolled in this course", 409);
            }

            var quoteResult = await CalculateQuote(dTO.CourceId, dTO.Promocode);

            if (!quoteResult.Success)
            {
                return ServiceResult<CheckoutResponse>
                       .Fail(quoteResult.Message, quoteResult.StatusCode);
            }

            var quote = quoteResult.Data!;

            var order = new OrderModel
            {
                Id = Guid.NewGuid().ToString(),
                UserId = user.Id,
                CourseId = quote.CourseId,
                AmountMinor = quote.TotalAmountMinor,
                OriginalAmountMinor = quote.OriginalAmountMinor,
                DiscountAmountMinor = quote.DiscountAmountMinor,
                Currency = quote.Currency,
                Promocode = quote.Promocode,
                Status = OrderStatus.Pending,
                CreatedAt = DateTime.UtcNow,
            };

            await db.Orders.AddAsync(order);

            // * Free course or 100% discount: enroll immediately without Stripe
            if (order.AmountMinor == 0)
            {
                var fulfillResult = await FulfillOrder(order);

                if (!fulfillResult.Success)
                {
                    return ServiceResult<CheckoutResponse>
                           .Fail(fulfillResult.Message, fulfillResult.StatusCode);
                }

                return ServiceResult<CheckoutResponse>.Ok(ToCheckoutResponse(order, null), "You enrolled successfully");
            }

            await db.SaveChangesAsync();

            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            UnitAmount = order.AmountMinor,
                            Currency = order.Currency,
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = quote.CourseTitle,
                            },
                        },
                        Quantity = 1,
                    },
                },
                Mode = "payment",
                SuccessUrl = configuration["Stripe:Url"] + $"/success?session_id={{CHECKOUT_SESSION_ID}}&course_id={order.CourseId}",
                CancelUrl = configuration["Stripe:Url"] + $"/cancel",
                ClientReferenceId = order.Id,
                Metadata = new Dictionary<string, string> { { "orderId", order.Id } },
            };

            Session session;

            try
            {
                var service = new SessionService();
                session = await service.CreateAsync(options);
            }
            catch (Stripe.StripeException ex)
            {
                order.Status = OrderStatus.Failed;
                await db.SaveChangesAsync();

                return ServiceResult<CheckoutResponse>
                       .Fail($"Failed to create payment session: {ex.Message}", 502);
            }

            order.StripeSessionId = session.Id;
            await db.SaveChangesAsync();

            return ServiceResult<CheckoutResponse>.Ok(ToCheckoutResponse(order, session.Url), "Payment session created successfully");
        }

        public async Task<ServiceResult<QuoteResponse>> Quote(QuoteDTO dTO)
        {
            if (dTO == null || string.IsNullOrWhiteSpace(dTO.CourseId))
            {
                return ServiceResult<QuoteResponse>
                       .Fail("Course id is required", 400);
            }

            return await CalculateQuote(dTO.CourseId, dTO.Promocode);
        }

        // * Price breakdown in minor units, without creating orders or Stripe sessions
        private async Task<ServiceResult<QuoteResponse>> CalculateQuote(string courseId, string? promocodeValue)
        {
            var course = await db.Cources.AsNoTracking()
                                         .FirstOrDefaultAsync(c => c.Id == courseId);

            if (course == null)
            {
                return ServiceResult<QuoteResponse>
                       .Fail("Course not found with this id", 404);
            }

            decimal discountPercent = 0m;
            string? appliedPromocode = null;

            if (!string.IsNullOrWhiteSpace(promocodeValue))
            {
                string code = promocodeValue.Trim();
                var promocode = await db.Promocodes.AsNoTracking()
                                                   .FirstOrDefaultAsync(p => p.Promocode == code);

                if (promocode == null)
                {
                    return ServiceResult<QuoteResponse>
                           .Fail("There is no such promocode", 404);
                }

                if (promocode.WillExpireAt <= DateTime.UtcNow)
                {
                    return ServiceResult<QuoteResponse>
                           .Fail("This promocode has expired", 400);
                }

                discountPercent = Math.Clamp(promocode.Discount ?? 0m, 0m, 100m);
                appliedPromocode = promocode.Promocode;
            }

            long originalAmountMinor = (long)Math.Round((decimal)course.Price * 100m, MidpointRounding.AwayFromZero);
            long discountAmountMinor = (long)Math.Round(originalAmountMinor * discountPercent / 100m, MidpointRounding.AwayFromZero);

            var quote = new QuoteResponse
            {
                CourseId = course.Id,
                CourseTitle = course.Title,
                Promocode = appliedPromocode,
                DiscountPercent = discountPercent,
                OriginalAmountMinor = originalAmountMinor,
                DiscountAmountMinor = discountAmountMinor,
                TotalAmountMinor = Math.Max(0, originalAmountMinor - discountAmountMinor),
                Currency = "uah",
            };

            return ServiceResult<QuoteResponse>.Ok(quote, "Price calculated successfully");
        }

        public async Task<ServiceResult<string>> CheckStatus(CheckStatusDTO dTO)
        {
            var service = new SessionService();
            Session session;

            try
            {
                session = await service.GetAsync(dTO.SessionId);
            }
            catch
            {
                return ServiceResult<string>
                       .Fail("Invalid session id", 400);
            }

            if (session.PaymentStatus != "paid")
            {
                return ServiceResult<string>
                       .Fail("Payment not completed", 400);
            }

            var order = await db.Orders.FirstOrDefaultAsync(o => o.StripeSessionId == session.Id ||
                                                                 o.Id == session.ClientReferenceId);

            if (order == null)
            {
                return ServiceResult<string>
                       .Fail("Order not found for this session", 404);
            }

            return await FulfillOrder(order);
        }

        // * Marks order as paid and enrolls the user
        private async Task<ServiceResult<string>> FulfillOrder(OrderModel order)
        {
            if (order.Status == OrderStatus.Paid)
            {
                return ServiceResult<string>
                       .Ok("Already enrolled", "Order already paid");
            }

            var user = await db.Users.FirstOrDefaultAsync(u => u.Id == order.UserId);

            if (user == null)
            {
                return ServiceResult<string>
                       .Fail("Profile not found", 404);
            }

            var cource = await db.Cources.FirstOrDefaultAsync(c => c.Id == order.CourseId);

            if (cource == null)
            {
                return ServiceResult<string>
                       .Fail("There is no cource with this id", 404);
            }

            order.Status = OrderStatus.Paid;
            order.PaidAt = DateTime.UtcNow;

            user.EnrolledCourcesId ??= new List<string>();

            if (!user.EnrolledCourcesId.Contains(order.CourseId))
            {
                user.EnrolledCourcesId.Add(order.CourseId);
                cource.StudentsCount++;
            }

            await db.SaveChangesAsync();

            return ServiceResult<string>.Ok("Success", "You enrolled successfully");
        }

        private static CheckoutResponse ToCheckoutResponse(OrderModel order, string? checkoutUrl)
        {
            return new CheckoutResponse
            {
                OrderId = order.Id,
                Status = order.Status,
                IsEnrolled = order.Status == OrderStatus.Paid,
                CheckoutUrl = checkoutUrl,
                OriginalAmountMinor = order.OriginalAmountMinor,
                DiscountAmountMinor = order.DiscountAmountMinor,
                TotalAmountMinor = order.AmountMinor,
                Currency = order.Currency,
            };
        }
    }
}
