using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Utils;
using Backend.DTO.User.Accounting;
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

            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            UnitAmount = (long)(course.Price * 100),
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

            user.EnrolledCourcesId.Add(courseId);
            db.Users.Update(user);
            await db.SaveChangesAsync();

            return ServiceResult<string>.Ok("Success", "You enrolled successfully");
        }
    }
}
