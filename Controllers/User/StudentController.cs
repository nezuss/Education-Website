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
        private readonly AccountingService accountingService;

        public StudentController
        (
            StudentService _studentService,
            AccountingService _accountingService
        )
        {
            studentService = _studentService;
            accountingService = _accountingService;
        }

        [HttpGet("orders")]
        [Authorize]
        public async Task<IActionResult> GetOrders([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await accountingService.GetStudentOrders(userId, page, pageSize);

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

        [HttpPost("lessons/{id}/complete")]
        [Authorize]
        public async Task<IActionResult> CompleteLesson(string id)
        {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await studentService.CompleteLesson(id, userId);

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
