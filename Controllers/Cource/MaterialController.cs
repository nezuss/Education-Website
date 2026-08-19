using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Services.Cource;
using Backend.DTO.Cource;
using Backend.Attributes.Auth;
using Backend.Models;

namespace Backend.Controllers.Cource
{
    [ApiController]
    [Route("/api/cource/material")]
    public class MaterialController : ControllerBase
    {
        private readonly MaterialService materialService;
        private readonly IWebHostEnvironment env;
        private readonly DBContextModel db;

        public MaterialController(
            MaterialService _materialService,
            IWebHostEnvironment _env,
            DBContextModel _db
        )
        {
            materialService = _materialService;
            env = _env;
            db = _db;
        }

        [HttpPost("upload")]
        [Authorize]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return StatusCode(400, new
                {
                    message = "File is empty or missing",
                    errorCode = 400,
                    time = DateTime.UtcNow
                });
            }

            string webRootPath = env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var request = HttpContext.Request;

            var result = await materialService.UploadFile(file, webRootPath, request.Scheme, request.Host.ToString());

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

        [HttpGet("get-all-on-lesson/{id}")]
        [Authorize]
        public async Task<IActionResult> GetAllOnLesson(string id)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var result = await materialService.GetAllOnLesson(id, userId);

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
        [Permission(Permissions.MaterialCreate)]
        public async Task<IActionResult> CreateMaterial(CreateMaterialDTO dTO)
        {
            var result = await materialService.CreateMaterial(dTO);

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

        [HttpPost("test-bind")]
        public IActionResult TestBind([FromBody] UpdateMaterialDTO dTO)
        {
            return Ok(new { success = dTO.Questions != null, count = dTO.Questions?.Count });
        }

        [HttpPatch("update")]
        [Permission(Permissions.MaterialUpdate)]
        public async Task<IActionResult> UpdateMaterial(UpdateMaterialDTO dTO)
        {
            var result = await materialService.UpdateMaterial(dTO);

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
        [Permission(Permissions.MaterialDelete)]
        public async Task<IActionResult> DeleteMaterial(string id)
        {
            var result = await materialService.DeleteMaterial(id);

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
