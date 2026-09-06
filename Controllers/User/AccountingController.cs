using Microsoft.AspNetCore.Mvc;
using Backend.Services.User;
using Backend.DTO.User.Accounting;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Backend.Controllers.User
{
    [ApiController]
    [Route("/account/accounting")]
    public class AccountingController : ControllerBase
    {
        private readonly AccountingService accountingService;

        public AccountingController
        (
            AccountingService _accountingService
        )
        {
            accountingService = _accountingService;
        }

        [HttpPost("check-status")]
        [Authorize]
        public async Task<IActionResult> CheckStatus(CheckStatusDTO dTO)
        {
            var result = await accountingService.CheckStatus(dTO);

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
