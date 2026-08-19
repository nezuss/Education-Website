using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Services.Cource;
using Backend.DTO.Cource;
using Backend.Attributes.Auth;

namespace Backend.Controllers.Cource
{
    [ApiController]
    [Route("/api/cource/lesson")]
    public class LessonController : ControllerBase
    {
        private readonly LessonService lessonService;

        public LessonController(
            LessonService _lessonService
        )
        {
            lessonService = _lessonService;
        }

        [HttpGet("get-all-on-module/{id}")]
        [Authorize]
        public async Task<IActionResult> GetAllOnModule(string id)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var result = await lessonService.GetAllOnModule(id, userId);

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
        [Permission(Permissions.LessonCreate)]
        public async Task<IActionResult> CreateLesson(CreateLessonDTO dTO)
        {
            var result = await lessonService.CreateLesson(dTO);

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
        [Permission(Permissions.LessonUpdate)]
        public async Task<IActionResult> UpdateLesson(UpdateLessonDTO dTO)
        {
            var result = await lessonService.UpdateLesson(dTO);

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
        [Permission(Permissions.LessonDelete)]
        public async Task<IActionResult> DeleteModule(string id)
        {
            var result = await lessonService.DeleteLesson(id);

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
