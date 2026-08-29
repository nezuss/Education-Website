using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Backend.Services.Cource;
using Backend.DTO.Cource.MaterialAnswers;

namespace Backend.Controllers.Cource
{
    [ApiController]
    [Route("/api/cource/submit-material")]
    [Authorize]
    public class SubmitMaterialAnswerController : ControllerBase
    {
        private readonly SubmitMaterialAnswerService submitMaterialAnswerService;
        private readonly IWebHostEnvironment env;

        public SubmitMaterialAnswerController
        (
            SubmitMaterialAnswerService _submitMaterialAnswerService,
            IWebHostEnvironment _env
        )
        {
            submitMaterialAnswerService = _submitMaterialAnswerService;
            env = _env;
        }

        [HttpGet("status/{materialId}")]
        public async Task<IActionResult> GetSubmissionStatus(string materialId)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var result = await submitMaterialAnswerService.GetSubmissionStatus(materialId, userId);

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

        [HttpPost("test")]
        public async Task<IActionResult> SubmitTest(SubmitTestAnswerDTO dTO)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var result = await submitMaterialAnswerService.SubmitTest(dTO, userId);

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

        [HttpPost("assignment")]
        public async Task<IActionResult> SubmitAssignment([FromForm] IFormFile file, [FromForm] string assignmentId)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (file == null || file.Length == 0)
            {
                return StatusCode(400, new
                {
                    message = "File is empty or missing",
                    errorCode = 400,
                    time = DateTime.UtcNow
                });
            }

            string webRootPath = env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var request = HttpContext.Request;

            var result = await submitMaterialAnswerService.SubmitAssignment(file, assignmentId, userId, webRootPath, request.Scheme, request.Host.ToString());

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
