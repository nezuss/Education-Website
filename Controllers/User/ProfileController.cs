using Microsoft.AspNetCore.Mvc;
using Backend.Services.Profile;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Backend.Controllers.User
{
    [ApiController]
    [Route("/profile")]
    public class ProfileController : ControllerBase
    {
        private readonly PublicProfileService publicProfileService;

        public ProfileController
        (
            PublicProfileService _publicProfileService
        )
        {
            publicProfileService = _publicProfileService;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            string id = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await publicProfileService.GetProfile(id);

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

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProfileById(string id)
        {
            var result = await publicProfileService.GetProfile(id);

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
