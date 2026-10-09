using Microsoft.AspNetCore.Mvc;
using Backend.Services.Mentor;
using Backend.Attributes.Auth;
using System.Security.Claims;

namespace Backend.Controllers.Mentor
{
    [ApiController]
    [Route("/mentor")]
    public class MentorController : ControllerBase
    {
        private readonly MentorService mentorService;

        public MentorController
        (
            MentorService _mentorService
        )
        {
            mentorService = _mentorService;
        }

        [HttpGet("courses")]
        [Permission(Permissions.GetMentorsCoursesStats)]
        public async Task<IActionResult> GetCourses()
        {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await mentorService.GetCourses(userId);

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

        [HttpGet("submissions")]
        [Permission(Permissions.GetMentorsSubmissionsStats)]
        public async Task<IActionResult> GetSubmissions()
        {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await mentorService.GetSubmissions(userId);

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

        [HttpGet("students")]
        [Permission(Permissions.GetMentorsSubmissionsStats)]
        public async Task<IActionResult> GetStudents([FromQuery] string courseId, [FromQuery] int page, [FromQuery] int pageSize)
        {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await mentorService.GetStudents(userId, courseId, page, pageSize);

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
