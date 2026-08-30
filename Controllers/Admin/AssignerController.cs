using Microsoft.AspNetCore.Mvc;
using Backend.Services.Admin;
using Backend.DTO.Admin;
using Backend.Attributes.Auth;
using Backend.Models;

namespace Backend.Controllers.Admin
{
    [ApiController]
    [Route("/admin/assign")]
    public class AssignerController : ControllerBase
    {
        private readonly AssignerService assignerService;

        public AssignerController
        (
            AssignerService _assignerService
        )
        {
            assignerService = _assignerService;
        }

        [HttpPost("teacher-to-cource")]
        [Permission(Permissions.AssignTeacherToCource)]
        public async Task<IActionResult> AssignTeacherToCource(AssignTeacherToCourceDTO dTO)
        {
            var result = await assignerService.AssignTeacherToCource(dTO);

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

        [HttpPost("module-to-cource")]
        [Permission(Permissions.AssignModuleToCource)]
        public async Task<IActionResult> AssignModuleToCource(AssignModuleToCourceDTO dTO)
        {
            var result = await assignerService.AssignModuleToCource(dTO);

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

        [HttpPost("lesson-to-module")]
        [Permission(Permissions.AssignLessonToModule)]
        public async Task<IActionResult> AssignLessonToModule(AssignLessonToModuleDTO dTO)
        {
            var result = await assignerService.AssignLessonToModule(dTO);

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

        [HttpPost("material-to-lesson")]
        [Permission(Permissions.AssignMaterialToLesson)]
        public async Task<IActionResult> AssignMaterialToLesson(AssignMaterialToLessonDTO dTO)
        {
            var result = await assignerService.AssignMaterialToLesson(dTO);

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
