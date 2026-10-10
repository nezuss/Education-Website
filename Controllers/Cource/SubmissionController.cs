using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Services.Cource;
using Backend.DTO.Cource.Submission;
using Backend.Attributes.Auth;
using System.Security.Claims;

namespace Backend.Controllers.Cource
{
    [ApiController]
    [Route("/submissions")]
    public class SubmissionController : ControllerBase
    {
        private readonly SubmissionService submissionService;

        public SubmissionController(
            SubmissionService _submissionService
        )
        {
            submissionService = _submissionService;
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetDetails(string id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await submissionService.GetDetails(id, userId);

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

        [HttpGet("{id}/file")]
        [Authorize]
        public async Task<IActionResult> GetFile(string id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await submissionService.GetFile(id, userId);

            if (!result.Success)
            {
                return StatusCode(result.StatusCode, new
                {
                    message = result.Message,
                    errorCode = result.StatusCode,
                    time = DateTime.UtcNow
                });
            }

            return PhysicalFile(result.Data.FilePath, result.Data.ContentType, result.Data.FileName);
        }

        [HttpPost("{id}/feedback")]
        [Permission(Permissions.SendSubmissionFeedback)]
        public async Task<IActionResult> SendFeedback(string id, SendFeedbackDTO dTO)
        {
            var result = await submissionService.SendFeedback(id, dTO);

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

        [HttpPost("{id}/request-revision")]
        [Permission(Permissions.RequestSubmissionRevision)]
        public async Task<IActionResult> RequestRevision(string id, RequestRevisionDTO dTO)
        {
            var result = await submissionService.RequestRevision(id, dTO);

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
