using Microsoft.AspNetCore.Mvc;
using Backend.Services.User;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Backend.Controllers.User
{
    [ApiController]
    [Route("/student")]
    public class StudentController : ControllerBase
    {
        private readonly StudentService studentService;

        public StudentController
        (
            StudentService _studentService
        )
        {
            studentService = _studentService;
        }

        [HttpGet("submissions")]
        [Authorize]
        public async Task<IActionResult> GetSubmissions()
        {
            string id = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await studentService.GetSubmissions(id);

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
