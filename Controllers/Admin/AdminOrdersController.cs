using Microsoft.AspNetCore.Mvc;
using Backend.Services.User;
using Backend.Attributes.Auth;

namespace Backend.Controllers.Admin
{
    [ApiController]
    [Route("/admin/orders")]
    public class AdminOrdersController : ControllerBase
    {
        private readonly AccountingService accountingService;

        public AdminOrdersController
        (
            AccountingService _accountingService
        )
        {
            accountingService = _accountingService;
        }

        [HttpGet]
        [Permission(Permissions.GetOrders)]
        public async Task<IActionResult> GetOrders([FromQuery] string? status, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var result = await accountingService.GetAdminOrders(status, page, pageSize);

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

        [HttpGet("{id}")]
        [Permission(Permissions.GetOrders)]
        public async Task<IActionResult> GetOrder(string id)
        {
            var result = await accountingService.GetAdminOrder(id);

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
