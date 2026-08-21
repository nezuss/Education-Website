using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Services.Stats;
using Backend.Attributes.Auth;

namespace Backend.Controllers.Stats
{
    [ApiController]
    [Route("/api/stats/users")]
    public class UsersStatsController : ControllerBase
    {
        private readonly UsersStatsService usersStatsService;

        public UsersStatsController
        (
            UsersStatsService _usersStatsService
        )
        {
            usersStatsService = _usersStatsService;
        }

        [HttpGet("get-total-count")]
        [Permission(Permissions.GetTotalUsers)]
        public async Task<IActionResult> GetTotalUsers()
        {
            var result = await usersStatsService.GetTotalUsers();

            if (!result.Success)
            {
                return StatusCode(result.StatusCode, new
                {
                    message = result.Message,
                    errorCode = result.StatusCode,
                    time = DateTime.UtcNow
                });
            }

            return Ok(new
            {
                message = result.Message,
                data = result.Data
            });
        }
    }
}
