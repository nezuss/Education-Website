using Microsoft.AspNetCore.Mvc;
using Backend.Services.Admin;
using Backend.DTO.Admin;
using Backend.Attributes.Auth;
using Backend.Models;

namespace Backend.Controllers.Admin
{
    [ApiController]
    [Route("/admin/promocode")]
    public class PromocodeController : ControllerBase
    {
        private readonly PromocodeService promocodeService;

        public PromocodeController
        (
            PromocodeService _promocodeService
        )
        {
            promocodeService = _promocodeService;
        }

        [HttpPost("get-all")]
        [Permission(Permissions.GetPromocodes)]
        public async Task<IActionResult> GetAllPromocodes()
        {
            var result = await promocodeService.GetAllPromocodes();

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
        [Permission(Permissions.CreatePromocode)]
        public async Task<IActionResult> CreatePromocode(CreatePromocodeDTO dTO)
        {
            var result = await promocodeService.CreatePromocodeDTO(dTO);

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

        [HttpPost("update")]
        [Permission(Permissions.UpdatePromocode)]
        public async Task<IActionResult> UpdatePromocode(UpdatePromocodeDTO dTO)
        {
            var result = await promocodeService.UpdatePromocode(dTO);

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

        [HttpPost("delete")]
        [Permission(Permissions.DeletePromocode)]
        public async Task<IActionResult> DeletePromocode(DeletePromocodeDTO dTO)
        {
            var result = await promocodeService.UpdatePromocodeDTO(dTO);

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
