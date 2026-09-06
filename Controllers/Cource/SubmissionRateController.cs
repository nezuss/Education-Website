using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Services.Cource;
using Backend.DTO.Cource;
using Backend.Attributes.Auth;
using System.Security.Claims;

namespace Backend.Controllers.Cource
{
    [ApiController]
    [Route("/api/cource/rate")]
    public class SubmissionRateController : ControllerBase
    {
        private readonly SubmissionRateService submissionRateService;

        public SubmissionRateController
        (
            SubmissionRateService _submissionRateService
        )
        {
            submissionRateService = _submissionRateService;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> RateSubmission(RateSubmissionDTO dTO)
        {
            string id = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await submissionRateService.RateSubmission(dTO, id);

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
