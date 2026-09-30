using Microsoft.AspNetCore.Mvc;
using Backend.Services.User;
using Backend.DTO.User.AccountManagement;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Backend.Controllers.User
{
    [ApiController]
    [Route("/account/management")]
    public class AccountManagementController : ControllerBase
    {
        private readonly AccountManagementService accountManagementService;

        public AccountManagementController
        (
            AccountManagementService _accountManagementService
        )
        {
            accountManagementService = _accountManagementService;
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDTO dTO)
        {
            var result = await accountManagementService.ResetPassword(dTO);

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

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordDTO dTO)
        {
            var result = await accountManagementService.ChangePassword(dTO);

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
