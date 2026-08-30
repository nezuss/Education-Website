using Microsoft.AspNetCore.Mvc;
using Backend.Services.Admin;
using Backend.DTO.Admin;
using Backend.Attributes.Auth;
using Backend.Models;

namespace Backend.Controllers.Admin
{
    [ApiController]
    [Route("/admin/unassign")]
    public class UnassignerController : ControllerBase
    {
        private readonly UnassignerService unassignerService;

        public UnassignerController
        (
            UnassignerService _unassignerService
        )
        {
            unassignerService = _unassignerService;
        }

        [HttpPost("teacher-from-cource")]
        [Permission(Permissions.UnassignTeacherFromCource)]
        public async Task<IActionResult> UnassignTeacherFromCource(UnassignTeacherFromCourceDTO dTO)
        {
            var result = await unassignerService.UnassignTeacherFromCource(dTO);

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

        [HttpPost("module-from-cource")]
        [Permission(Permissions.UnassignModuleFromCource)]
        public async Task<IActionResult> UnassignModuleFromCource(UnassignModuleFromCourceDTO dTO)
        {
            var result = await unassignerService.UnassignModuleFromCource(dTO);

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

        [HttpPost("lesson-from-module")]
        [Permission(Permissions.UnassignLessonFromModule)]
        public async Task<IActionResult> UnassignLessonFromModule(UnassignLessonFromModuleDTO dTO)
        {
            var result = await unassignerService.UnassignLessonFromModule(dTO);

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

        [HttpPost("material-from-lesson")]
        [Permission(Permissions.UnassignMaterialFromLesson)]
        public async Task<IActionResult> UnassignMaterialFromLesson(UnassignMaterialFromLessonDTO dTO)
        {
            var result = await unassignerService.UnassignMaterialFromLesson(dTO);

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
