using Backend.Services.JWT;
using Backend.Models;
using Backend.DTO.Auth;
using Backend.Utils;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using BCrypt.Net;

namespace Backend.Services.Auth
{
    public class UserService
    {
        private readonly DBContextModel db;
        private readonly JWTService jWTService;
        private readonly IMemoryCache cache;
        private readonly IConfiguration configuration;

        public UserService(DBContextModel _db, JWTService _jWTService,
                           IMemoryCache _cache, IConfiguration _configuration)
        {
            db = _db;
            jWTService = _jWTService;
            cache = _cache;
            configuration = _configuration;
        }

        public async Task<ServiceResult<UserModel>> SignUp(SignUpDTO dTO)
        {
            if (string.IsNullOrEmpty(dTO.Email) ||
                string.IsNullOrEmpty(dTO.Username) ||
                string.IsNullOrEmpty(dTO.Password))
            {
                return ServiceResult<UserModel>
                       .Fail("All fields are required", 400);
            }

            var existedUserEmail = await db.Users
                                         .FirstOrDefaultAsync(u => u.Email == dTO.Email);

            if (existedUserEmail != null)
            {
                return ServiceResult<UserModel>
                       .Fail("User already exists with this email", 400);
            }

            var code = new Random().Next(100000, 1000000).ToString();

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Nexylva", configuration["Smtp:From"]));
            message.To.Add(new MailboxAddress("", dTO.Email));
            message.Subject = "Email confirmation";

            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = $@"
                    <!DOCTYPE html>
                    <html lang=""ru"">
                    <head>
                        <meta charset=""UTF-8"">
                        <title>Підтвердження пошти</title>
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
                            <h1>Підтвердження пошти</h1>
                            <p>Для завершення реєстрації або входу в обліковий запис, будь ласка, введіть наступний код підтвердження:</p>

                            <div class=""code-block"">
                                <p class=""code"">{code}</p>
                            </div>

                            <p class=""warning"">Нікому не повідомляйте цей код. Якщо ви не запитували код, просто проігноруйте цей лист.</p>

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

            cache.Set(code, dTO.Email, TimeSpan.FromMinutes(30));

            string salt = BCrypt.Net.BCrypt.GenerateSalt(workFactor: 12);
            UserModel user = new UserModel
            {
                Id = Guid.NewGuid().ToString(),
                Email = dTO.Email,
                Username = dTO.Username,
                Password = BCrypt.Net.BCrypt.HashPassword(dTO.Password, salt),
                AuthorizedKeyId = "",
                Salt = salt,
                RoleId = "",
                IsEmailConfirmed = false,
                UpdatedAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
            };

            await db.Users.AddAsync(user);
            await db.SaveChangesAsync();

            return ServiceResult<UserModel>.Ok(user, "User registered successfully, code sent to email");
        }

        public async Task<ServiceResult<string>> ConfirmEmail(string code)
        {
            if (!cache.TryGetValue(code, out string email))
                return ServiceResult<string>.Fail("Code is invalid or expired", 400);

            var existedUser = await db.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (existedUser == null)
                return ServiceResult<string>.Fail("User not found", 404);

            existedUser.IsEmailConfirmed = true;
            await db.SaveChangesAsync();

            cache.Remove(code);

            return ServiceResult<string>.Ok("Email successfully confirmed", "Your account now activated");
        }

        public async Task<ServiceResult<string>> SignIn(SignInDTO dTO) {
            if (string.IsNullOrEmpty(dTO.Email) ||
                string.IsNullOrEmpty(dTO.Password))
            {
                return ServiceResult<string>
                       .Fail("All fields are required", 400);
            }

            var user = await db.Users
                             .FirstOrDefaultAsync(u => u.Email == dTO.Email);

            if (user == null)
            {
                return ServiceResult<string>
                       .Fail("User does not exist with this email", 404);
            }

            if (user.IsEmailConfirmed == false)
            { return ServiceResult<string>.Fail("Please confirm your email", 403); }

            dTO.Password = BCrypt.Net.BCrypt.HashPassword(dTO.Password, user.Salt);

            if (BCrypt.Net.BCrypt.Verify(dTO.Password, user.Password))
            { return ServiceResult<string>.Fail("Credentials are wrong", 401); }

            string AuthorizedKeyId = Guid.NewGuid().ToString();
            string token = jWTService.GenerateToken(user, AuthorizedKeyId);
            user.AuthorizedKeyId = AuthorizedKeyId;

            db.Users.Update(user);
            await db.SaveChangesAsync();

            return ServiceResult<string>.Ok(token, "You successfully signed in");
        }

        public async Task<ServiceResult<string>> SignOut()
        {
            return ServiceResult<string>.Ok("Token unauthorized successfully",
                                            "You successfully signed out");
        }

        public async Task<UserModel> GetUserByIdAsync(string id)
        {
            var user = await db.Users.FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            { return new UserModel(); }

            var saveUser = new UserModel();
            saveUser = user;

            saveUser.Password = "";
            saveUser.Salt = "";

            return saveUser;
        }
    }
}
