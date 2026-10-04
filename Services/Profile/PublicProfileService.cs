using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Utils;
using Backend.Responses.Profile;
using Backend.Models.Cource;
using Backend.Models.Cource.MaterialAnswers;

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

            ProfileResponse profile = new ProfileResponse {
                Username = user.Username
            };

            return ServiceResult<ProfileResponse>
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
    }
}
