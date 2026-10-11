using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Utils;
using Backend.Responses.Profile;
using Backend.Models.Cource;
using Backend.Models.Cource.MaterialAnswers;
using Backend.DTO.User;

namespace Backend.Services.Profile
{
    public class PublicProfileService
    {
        private readonly DBContextModel db;

        public PublicProfileService
        (
            DBContextModel _db
        )
        {
            db = _db;
        }

        public async Task<ServiceResult<ProfileResponse>> GetProfile(string Id)
        {
            var user = await db.Users
                             .AsNoTracking()
                             .FirstOrDefaultAsync(u => u.Id == Id);

            if (user == null)
            {
                return ServiceResult<ProfileResponse>
                       .Fail("Profile not found with this id", 404);
            }

            ProfileResponse profile = new ProfileResponse
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = await GetRoleName(user.RoleId),
                IsEmailConfirmed = user.IsEmailConfirmed,
                CreatedAt = user.CreatedAt,
                AvatarUrl = user.AvatarUrl,
                Bio = user.Bio,
            };

            return ServiceResult<ProfileResponse>
                   .Ok(profile, "Profile found successfuly");
        }

        public async Task<ServiceResult<PublicProfileResponse>> GetPublicProfile(string Id)
        {
            var user = await db.Users
                               .AsNoTracking()
                               .FirstOrDefaultAsync(u => u.Id == Id);

            if (user == null)
            {
                return ServiceResult<PublicProfileResponse>
                       .Fail("Profile not found with this id", 404);
            }

            PublicProfileResponse profile = new PublicProfileResponse
            {
                Id = user.Id,
                Username = user.Username,
                Role = await GetRoleName(user.RoleId),
                CreatedAt = user.CreatedAt,
                AvatarUrl = user.AvatarUrl,
                Bio = user.Bio,
            };

            return ServiceResult<PublicProfileResponse>
                   .Ok(profile, "Profile found successfuly");
        }

        public async Task<ServiceResult<UserStatsResponse>> GetStats(string Id)
        {
            var user = await db.Users
                             .AsNoTracking()
                             .FirstOrDefaultAsync(u => u.Id == Id);

            if (user == null)
            {
                return ServiceResult<UserStatsResponse>
                       .Fail("Profile not found with this id", 404);
            }

            List<CourceModel> cources = new List<CourceModel>();
            List<MaterialSubmissionModel> submissions = new List<MaterialSubmissionModel>();

            if (user.EnrolledCourcesId != null)
                cources = await db.Cources
                                .AsNoTracking()
                                .Where(c => user.EnrolledCourcesId.Contains(c.Id))
                                .ToListAsync();

            submissions = await db.MaterialSubmissions
                                .Where(ms => ms.UserId == Id)
                                .ToListAsync();

            UserStatsResponse stats = new UserStatsResponse
            {
                Cources = cources,
                Submissions = submissions,
            };

            return ServiceResult<UserStatsResponse>
                   .Ok(stats, "User stats found successfuly");
        }

        public async Task<ServiceResult<string>> UpdateProfile(string Id, UpdateProfileDTO dTO)
        {
            var user = await db.Users.FirstOrDefaultAsync(u => u.Id == Id);

          
            if (user == null)
            {
                return ServiceResult<string>
                       .Fail("User not found with this id", 404);
            }
          
            if (!string.IsNullOrWhiteSpace(dTO.Username))
                user.Username = dTO.Username;

            if (dTO.AvatarUrl != null)
                user.AvatarUrl = string.IsNullOrWhiteSpace(dTO.AvatarUrl) ? null : dTO.AvatarUrl;

            if (dTO.Bio != null)
                user.Bio = string.IsNullOrWhiteSpace(dTO.Bio) ? null : dTO.Bio;

            user.UpdatedAt = DateTime.UtcNow;

            db.Users.Update(user);
            await db.SaveChangesAsync();

            return ServiceResult<string>
                   .Ok("Profile updated", "Profile updated successfuly");
        }

        private async Task<string> GetRoleName(string? RoleId)
        {
            if (string.IsNullOrEmpty(RoleId)) return "User";

            var role = await db.Roles
                               .AsNoTracking()
                               .FirstOrDefaultAsync(r => r.Id == RoleId);

            return role?.Name ?? "User";
        }
    }
}
