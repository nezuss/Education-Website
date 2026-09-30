using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Utils;
using Backend.DTO.User.AccountManagement;
using Microsoft.Extensions.Caching.Memory;
using Stripe.Checkout;
using Microsoft.Extensions.Configuration;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace Backend.Services.User
{
    public class AccountManagementService
    {
        private readonly DBContextModel db;
        private readonly IMemoryCache cache;
        private readonly IConfiguration configuration;

        public AccountManagementService
        (
            DBContextModel _db, IMemoryCache _cache,
            IConfiguration _configuration
        )
        {
            db = _db;
            cache = _cache;
            configuration = _configuration;
        }

        public async Task<ServiceResult<string>> ResetPassword(ResetPasswordDTO dTO)
        {
            var user = await db.Users.FirstOrDefaultAsync(u => u.Email == dTO.Email);

            if (user == null)
            {
                return ServiceResult<string>
                       .Fail("User not found with this email", 404);
            }

            string resetToken = BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString());

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Nexylva", configuration["Smtp:From"]));
            message.To.Add(new MailboxAddress("", dTO.Email));
            message.Subject = "Password reset";

            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = $@"
                    <!DOCTYPE html>
                    <html lang=""ru"">
                    <head>
                        <meta charset=""UTF-8"">
                        <title>Зміна паролю</title>
                        <style>
                            body {{
                                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                                background-color: #EFECE5;
                                margin: 0;
                                padding: 0;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                min-height: 100vh;
                                color: #1A1A1A;
                            }}
                            .container {{
                                background-color: #FFFFFF;
                                padding: 40px;
                                border-radius: 16px;
                                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
                                text-align: center;
                                max-width: 400px;
                                width: 90%;
                                margin: 40px auto;
                            }}
                            .logo {{
                                font-size: 24px;
                                font-weight: 700;
                                color: #1B4332;
                                margin-bottom: 24px;
                                letter-spacing: 1px;
                            }}
                            h1 {{ font-size: 20px; font-weight: 600; margin-bottom: 16px; color: #2D3748; }}
                            p {{ font-size: 15px; line-height: 1.5; color: #4A5568; margin-bottom: 32px; }}
                            .code-block {{
                                background-color: #EFECE5;
                                border-radius: 12px;
                                padding: 24px;
                                margin-bottom: 32px;
                            }}
                            .code {{
                                font-size: 36px;
                                font-weight: 700;
                                letter-spacing: 8px;
                                color: #1B4332;
                                margin: 0;
                            }}
                            .footer {{ font-size: 13px; color: #A0AEC0; margin-top: 24px; }}
                            .warning {{ font-size: 13px; color: #E53E3E; margin-top: 16px; }}
                        </style>
                    </head>
                    <body>
                        <div class=""container"">
                            <div class=""logo"">NEXYLVA</div>
                            <h1>Зміна паролю</h1>
                            <p>Для зміни паролю перейдіть по посиланню нижче:</p>

                            <div class=""code-block"">
                                <a href=""{configuration["Smtp:User"]}auth/reset-password/{resetToken}"" class=""code"">Змінити пароль</a>
                            </div>

                            <p class=""warning"">Нікому не повідомляйте це посилання. Якщо це булы не ви, просто проігноруйте цей лист.</p>

                            <div class=""footer"">
                                &copy; {DateTime.Now.Year} Nexylva Platform. Усі права захищені.
                            </div>
                        </div>
                    </body>
                    </html>"
            };

            message.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();

            await client.ConnectAsync(
                configuration["Smtp:Host"],
                int.Parse(configuration["Smtp:Port"]),
                SecureSocketOptions.Auto
            );

            await client.AuthenticateAsync(
                configuration["Smtp:User"],
                configuration["Smtp:Password"]
            );

            await client.SendAsync(message);
            await client.DisconnectAsync(true);

            cache.Set(resetToken, dTO.Email, TimeSpan.FromMinutes(30));

            return ServiceResult<string>.Ok("Check your email", "Reset link successfully sent");
        }

        public async Task<ServiceResult<string>> ChangePassword(ChangePasswordDTO dTO)
        {
            if (!cache.TryGetValue(dTO.ResetToken, out string email))
                return ServiceResult<string>.Fail("ResetToken is invalid or expired", 400);

            cache.Remove(dTO.ResetToken);

            var user = await db.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                return ServiceResult<string>
                       .Fail("User not found with this email", 404);
            }

            string salt = BCrypt.Net.BCrypt.GenerateSalt(workFactor: 12);
            user.Password = BCrypt.Net.BCrypt.HashPassword(dTO.Password, salt);
            user.Salt = salt;

            db.Users.Update(user);
            await db.SaveChangesAsync();

            return ServiceResult<string>.Ok("Now you can login with new password", "Password successfully changed");
        }
    }
}
