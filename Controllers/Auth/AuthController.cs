using Microsoft.AspNetCore.Mvc;
using Backend.Services.Auth;

namespace Backend.Controllers.Auth
{
    [ApiController]
    [Route("auth/")]
    public class AuthController : ControllerBase
    {
        private AccountService accountService;

        public AuthController(
            AccountService _accountService
        )
        {
            accountService = _accountService;
            Console.WriteLine("Auth Controller started");
        }

        [HttpPost("sign-up")]
        public IActionResult SignUp()
        {
            return Ok("Signed Up");
        }

        [HttpPost("sign-in")]
        public IActionResult SignIn()
        {
            return Ok("Signed In");
        }

        [HttpPost("sign-out")]
        public IActionResult SignOut()
        {
            return Ok("Signed Out");
        }
    }
}
