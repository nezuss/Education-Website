using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Services.Cource;
using Backend.DTO.Cource;
using Backend.Attributes.Auth;
using System.Security.Claims;

namespace Backend.Controllers.Cource
{
    [ApiController]
    [Route("/api/cource/stats")]
    public class CourceStatsController : ControllerBase
    {
        private readonly CourceStatsService courceStatsService;

        public CourceStatsController
        (
            CourceStatsService _courceStatsService
        )
        {
            courceStatsService = _courceStatsService;
        }

        [HttpGet("total-cource/{id}")]
        [Authorize]
        public async Task<IActionResult> GetTotalCourceStats(string id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var result = await courceStatsService.GetTotalCourceStats(id, userId!);

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

        [HttpGet("total-module/{id}")]
        [Authorize]
        public async Task<IActionResult> GetTotalModuleStats(string id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var result = await courceStatsService.GetTotalModuleStats(id, userId!);

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
