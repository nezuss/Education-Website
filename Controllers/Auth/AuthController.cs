using Microsoft.AspNetCore.Mvc;
using Backend.Services.Auth;
using Backend.DTO.Auth;

namespace Backend.Controllers.Auth
{
    [ApiController]
    [Route("auth/")]
    public class AuthController : ControllerBase
    {
        private readonly UserService userService;

        public AuthController(
            UserService _userService
        )
        {
            userService = _userService;
        }

        [HttpPost("sign-up")]
        public async Task<IActionResult> SignUp(SignUpDTO dTO)
        {
            var result = await userService.SignUp(dTO);

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

        [HttpPost("confirm-email/{code}")]
        public async Task<IActionResult> ConfirmEmail(string code)
        {
            var result = await userService.ConfirmEmail(code);

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

        [HttpPost("sign-in")]
        public async Task<IActionResult> SignIn(SignInDTO dTO)
        {
            var result = await userService.SignIn(dTO);

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

        [HttpPost("sign-out")]
        public async Task<IActionResult> SignOut()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var result = await userService.SignOut(userId);

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
