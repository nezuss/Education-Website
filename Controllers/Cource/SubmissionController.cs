using Microsoft.AspNetCore.Mvc;
using Backend.Services.Cource;
using Backend.DTO.Cource.Submission;
using Backend.Attributes.Auth;

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
