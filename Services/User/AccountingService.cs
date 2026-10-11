using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Utils;
using Backend.DTO.User.Accounting;
using Backend.DTO.Payment;
using Backend.Responses.Payment;
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

        public async Task<ServiceResult<string>> Pay(PayDTO dTO, string Id)
        {
            var user = await db.Users.FirstOrDefaultAsync(u => u.Id == Id);

            if (user == null)
            {
                return ServiceResult<string>
                       .Fail("User not found with this id", 404);
            }

            var course = await db.Cources.FirstOrDefaultAsync(c => c.Id == dTO.CourceId);

            if (course == null)
            {
                return ServiceResult<string>
                       .Fail("Course not found with this id", 404);
            }

            decimal discount = 0m;

            if (!string.IsNullOrWhiteSpace(dTO.Promocode))
            {
                var promocode = await db.Promocodes.FirstOrDefaultAsync(p => p.Promocode == dTO.Promocode);

                if (promocode == null)
                {
                    return ServiceResult<string>
                           .Fail("There is no such promocode", 404);
                }

                discount = promocode.Discount ?? 0m;
            }

            decimal finalPrice = (decimal)course.Price * (1.0m - (discount / 100.0m));
            long unitAmountInCents = (long)Math.Round(finalPrice * 100m, MidpointRounding.AwayFromZero);

            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            UnitAmount = unitAmountInCents,
                            Currency = "uah",
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = course.Title,
                            },
                        },
                        Quantity = 1,
                    },
                },
                Mode = "payment",
                SuccessUrl = configuration["Stripe:Url"] + $"/success?session_id={{CHECKOUT_SESSION_ID}}&course_id={course.Id}",
                CancelUrl = configuration["Stripe:Url"] + $"/cancel",
                ClientReferenceId = $"{Id}_{course.Id}"
            };

            var service = new SessionService();
            Session session = await service.CreateAsync(options);

            return ServiceResult<string>.Ok(session.Url, "Payment session created successfully");
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

            var parts = session.ClientReferenceId.Split('_');

            if (parts.Length != 2)
            {
                return ServiceResult<string>
                       .Fail("Invalid client reference data", 400);
            }

            string userId = parts[0];
            string courseId = parts[1];

            var user = await db.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return ServiceResult<string>
                       .Fail("Profile not found", 404);
            }

            user.EnrolledCourcesId ??= new List<string>();

            if (user.EnrolledCourcesId.Contains(courseId))
            {
                return ServiceResult<string>
                       .Ok("Already enrolled", "You already enrolled into this cource");
            }

            var cource = await db.Cources.FirstOrDefaultAsync(c => c.Id == courseId);

            if (cource == null)
            {
                return ServiceResult<string>
                       .Fail("There is no cource with this id", 404);
            }

            cource.StudentsCount++;

            user.EnrolledCourcesId.Add(courseId);
            db.Cources.Update(cource);
            db.Users.Update(user);
            await db.SaveChangesAsync();

            return ServiceResult<string>.Ok("Success", "You enrolled successfully");
        }
    }
}
