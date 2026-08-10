using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Backend.Services.Cource;
using Backend.DTO.Cource;

namespace Backend.Controllers.Cource
{
    [ApiController]
    [Route("api/cource/")]
    public class CourcesController : ControllerBase
    {
        private readonly CourcesService courcesService;

        public CourcesController(
            CourcesService _courcesService
        )
        {
            courcesService = _courcesService;
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetCources()
        {
            var result = await courcesService.GetCources();

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

        [HttpGet("get-enrolled")]
        [Authorize]
        public async Task<IActionResult> GetEnrolledCources()
        {
            string id = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await courcesService.GetEnrolledCources(id);

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

        [HttpPost("create")]
        public async Task<IActionResult> CreateCource(CreateCourceDTO dTO)
        {
            var result = await courcesService.CreateCource(dTO);

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

        [HttpPut("update")]
        public async Task<IActionResult> UpdateCource(UpdateCourceDTO dTO)
        {
            var result = await courcesService.UpdateCource(dTO);

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

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteCource(string Id)
        {
            var result = await courcesService.DeleteCource(Id);

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
