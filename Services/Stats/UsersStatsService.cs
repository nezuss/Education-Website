using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Utils;
using Backend.Responses.Stats;

namespace Backend.Services.Stats
{
    public class UsersStatsService
    {
        private readonly DBContextModel db;

        public UsersStatsService
        (
            DBContextModel _db
        )
        {
            db = _db;
        }

        public async Task<ServiceResult<List<TotalUsersResponse>>> GetTotalUsers()
        {
            var totalUsers = await db.Users.ToListAsync();

            if (totalUsers == null || totalUsers.Count() == 0)
            {
                return ServiceResult<List<TotalUsersResponse>>
                       .Fail("No users found", 404);
            }

            var stats = await db.Roles
                .Select(role => new TotalUsersResponse
                {
                    RoleName = role.Name,
                    UserCount = db.Users
                        .Where(u => u.RoleId == role.Id)
                        .Select(u => u.Id)
                        .Distinct()
                        .Count()
                })
                .ToListAsync();

            stats.Add(new TotalUsersResponse
            {
                RoleName = "None",
                UserCount = totalUsers.Count(),
            });

            return ServiceResult<List<TotalUsersResponse>>
                   .Ok(stats, "Users get successfuly");
        }
    }
}
