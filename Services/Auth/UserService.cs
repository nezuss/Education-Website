using Backend.Services.JWT;
using Backend.Models;
using Backend.DTO.Auth;
using Backend.Utils;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services.Auth
{
    public class UserService
    {
        private readonly DBContextModel db;
        private readonly JWTService jWTService;

        public UserService(DBContextModel _db, JWTService _jWTService)
        {
            db = _db;
            jWTService = _jWTService;
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

            UserModel user = new UserModel
            {
                Id = Guid.NewGuid().ToString(),
                Email = dTO.Email,
                Username = dTO.Username,
                Password = dTO.Password,
                AuthorizedKeyId = "",
                Salt = "",
                RoleId = "",
                UpdatedAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
            };

            await db.Users.AddAsync(user);
            await db.SaveChangesAsync();

            return ServiceResult<UserModel>.Ok(user, "User registered successfully");
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

            if (user.Password != dTO.Password)
            { return ServiceResult<string>.Fail("Credentials are wrong", 401); }

            string AuthorizedKeyId = Guid.NewGuid().ToString();
            string token = jWTService.GenerateToken(user, AuthorizedKeyId);
            user.AuthorizedKeyId = AuthorizedKeyId;

            db.Users.Update(user);
            await db.SaveChangesAsync();

            return ServiceResult<string>.Ok(token, "You successfully signed in");
        }

        public async Task<ServiceResult<string>> SignOut() {
            return ServiceResult<string>.Ok("Token unauthorized successfully",
                                            "You successfully signed out");
        }
    }
}
