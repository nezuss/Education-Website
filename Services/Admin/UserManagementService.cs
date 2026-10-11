using Backend.Models;
using Backend.DTO.Admin;
using Backend.Responses.Admin;
using Backend.Utils;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services.Admin
{
    public class UserManagementService
    {
        private readonly DBContextModel db;

        public UserManagementService
        (
            DBContextModel _db
        )
        {
            db = _db;
        }

        public async Task<ServiceResult<AdminUserResponse>> GetUser(string Id)
        {
            var user = await db.Users
                             .AsNoTracking()
                             .FirstOrDefaultAsync(u => u.Id == Id);

            if (user == null)
                return ServiceResult<AdminUserResponse>.Fail("There is no user with this id", 404);

            var roleNames = await GetRoleNames();

            return ServiceResult<AdminUserResponse>.Ok(ToResponse(user, roleNames), "User get successfully");
        }

        public async Task<ServiceResult<List<AdminUserResponse>>> GetAllUsers()
        {
            var users = await db.Users
                              .AsNoTracking()
                              .ToListAsync();

            if (users == null)
                return ServiceResult<List<AdminUserResponse>>.Fail("There is no users yet", 404);

            var roleNames = await GetRoleNames();
            var response = users.Select(u => ToResponse(u, roleNames)).ToList();

            return ServiceResult<List<AdminUserResponse>>.Ok(response,
                                            "Users get successfully");
        }

        public async Task<ServiceResult<string>> CreateUser(CreateUserDTO dTO)
        {
            var existedUser = await db.Users.FirstOrDefaultAsync(m => m.Email == dTO.Email);

            if (existedUser != null)
                return ServiceResult<string>.Fail("There is already user with this email", 404);

            string salt = BCrypt.Net.BCrypt.GenerateSalt(workFactor: 12);

            var user = new UserModel
            {
                Id = Guid.NewGuid().ToString(),
                Email = dTO.Email,
                Username = dTO.Username ?? dTO.Email.Split('@')[0],
                Password = BCrypt.Net.BCrypt.HashPassword(dTO.Password, salt),
                Salt = salt,
                AuthorizedKeyId = "",
                RoleId = "",
                IsEmailConfirmed = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };

            db.Users.Add(user);
            await db.SaveChangesAsync();

            return ServiceResult<string>.Ok("User created",
                                            "User created successfully");
        }

        public async Task<ServiceResult<string>> UpdateUser(UpdateUserDTO dTO)
        {
            var user = await db.Users.FirstOrDefaultAsync(m => m.Id == dTO.Id);

            if (user == null)
                return ServiceResult<string>.Fail("User not found with this id", 404);

            if (!string.IsNullOrWhiteSpace(dTO.Email))
                user.Email = dTO.Email;

            if (!string.IsNullOrWhiteSpace(dTO.Username))
                user.Username = dTO.Username;

            if (!string.IsNullOrWhiteSpace(dTO.Password))
            {
                string salt = BCrypt.Net.BCrypt.GenerateSalt(workFactor: 12);
                user.Password = BCrypt.Net.BCrypt.HashPassword(dTO.Password, salt);
                user.Salt = salt;
                user.AuthorizedKeyId = Guid.NewGuid().ToString();
            }

            user.UpdatedAt = DateTime.UtcNow;

            db.Users.Update(user);
            await db.SaveChangesAsync();

            return ServiceResult<string>.Ok("User updated",
                                            "User updated successfully");
        }

        public async Task<ServiceResult<string>> DeleteUser(string Id)
        {
            var user = await db.Users.FirstOrDefaultAsync(u => u.Id == Id);

            if (user == null)
                return ServiceResult<string>.Fail("There is no user with this id", 404);

            db.Users.Remove(user);
            await db.SaveChangesAsync();

            return ServiceResult<string>.Ok("User deleted",
                                            "User deleted successfully");
        }

        private async Task<Dictionary<string, string>> GetRoleNames()
        {
            return await db.Roles
                           .AsNoTracking()
                           .ToDictionaryAsync(r => r.Id, r => r.Name);
        }

        private static AdminUserResponse ToResponse(UserModel user, Dictionary<string, string> roleNames)
        {
            string roleName = "User";
            if (!string.IsNullOrEmpty(user.RoleId) && roleNames.TryGetValue(user.RoleId, out var name))
                roleName = name;

            return new AdminUserResponse
            {
                Id = user.Id,
                Email = user.Email,
                Username = user.Username,
                RoleId = user.RoleId,
                RoleName = roleName,
                IsEmailConfirmed = user.IsEmailConfirmed,
                EnrolledCourcesId = user.EnrolledCourcesId ?? new List<string>(),
                AvatarUrl = user.AvatarUrl,
                Bio = user.Bio,
                UpdatedAt = user.UpdatedAt,
                CreatedAt = user.CreatedAt,
            };
        }
    }
}
