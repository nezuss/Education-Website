using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Utils;
using Backend.Responses.Profile;

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
            var user = await db.Users.FirstOrDefaultAsync(u => u.Id == Id);

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
    }
}
