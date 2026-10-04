using Microsoft.AspNetCore.Mvc;
using Backend.Services.Admin;
using Backend.DTO.Admin;
using Backend.Attributes.Auth;
using Backend.Models;

namespace Backend.Controllers.Admin
{
    [ApiController]
    [Route("/admin/users")]
    public class UserManagementController : ControllerBase
    {
        private readonly UserManagementService userManagementService;

        public UserManagementController
        (
            UserManagementService _userManagementService
        )
        {
            userManagementService = _userManagementService;
        }

        [HttpPost("get/{id}")]
        [Permission(Permissions.GetUser)]
        public async Task<IActionResult> GetUser(string id)
        {
            var result = await userManagementService.GetUser(id);

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

        [HttpPost("get-all")]
        [Permission(Permissions.GetAllUsers)]
        public async Task<IActionResult> GetAllUsers()
        {
            var result = await userManagementService.GetAllUsers();

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
        [Permission(Permissions.CreateUser)]
        public async Task<IActionResult> CreateUser(CreateUserDTO dTO)
        {
            var result = await userManagementService.CreateUser(dTO);

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
        [Permission(Permissions.UpdateUser)]
        public async Task<IActionResult> UpdateUser(UpdateUserDTO dTO)
        {
            var result = await userManagementService.UpdateUser(dTO);

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

        [HttpPost("delete/{id}")]
        [Permission(Permissions.DeleteUser)]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var result = await userManagementService.DeleteUser(id);

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
