using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Services.Cource;
using Backend.DTO.Cource;
using Backend.Attributes.Auth;

namespace Backend.Controllers.Cource
{
    [ApiController]
    [Route("/api/cource/module")]
    public class ModuleController : ControllerBase
    {
        private readonly ModuleService moduleService;

        public ModuleController(
            ModuleService _moduleService
        )
        {
            moduleService = _moduleService;
        }

        [HttpGet("get-all-on-cource/{id}")]
        [Authorize]
        public async Task<IActionResult> GetAllOnCourceModule(string id)
        {
            var result = await moduleService.GetAllOnCourceModule(id);

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
        [Permission(Permissions.ModuleCreate)]
        public async Task<IActionResult> CreateModule(CreateModuleDTO dTO)
        {
            var result = await moduleService.CreateModule(dTO);

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

        [HttpPatch("update")]
        [Permission(Permissions.ModuleUpdate)]
        public async Task<IActionResult> UpdateMoudle(UpdateMoudleDTO dTO)
        {
            var result = await moduleService.UpdateMoudle(dTO);

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
        [Permission(Permissions.ModuleDelete)]
        public async Task<IActionResult> DeleteModule(string id)
        {
            var result = await moduleService.DeleteModule(id);

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
