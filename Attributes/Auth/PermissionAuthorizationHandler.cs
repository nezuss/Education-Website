using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Backend.Attributes.Auth
{
    public class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
    {
        private readonly IServiceScopeFactory scopeFactory;

        public PermissionAuthorizationHandler(IServiceScopeFactory _scopeFactory)
        {
            scopeFactory = _scopeFactory;
        }

        protected override async Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            PermissionRequirement requirement
        )
        {
            var idClaim = context.User.FindFirst(c => c.Type == ClaimTypes.NameIdentifier);

            if (idClaim == null || string.IsNullOrWhiteSpace(idClaim.Value))
            { return; }

            string id = idClaim.Value;

            using var scope = scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<DBContextModel>();

            var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Id == id);

            if (user == null || string.IsNullOrWhiteSpace(user.RoleId))
            { return; }

            var role = await dbContext.Roles.FirstOrDefaultAsync(r => r.Id == user.RoleId);

            if (role == null)
            { return; }

            bool hasPermission = false;

            switch (requirement.Permission)
            {
                // ? Course
                case Permissions.CourseCreate: hasPermission = role.CanCreateCourse; break;
                case Permissions.CourseUpdate: hasPermission = role.CanUpdateCourse; break;
                case Permissions.CourseDelete: hasPermission = role.CanDeleteCourse; break;

                // ? Module
                case Permissions.ModuleCreate: hasPermission = role.CanCreateModule; break;
                case Permissions.ModuleUpdate: hasPermission = role.CanUpdateModule; break;
                case Permissions.ModuleDelete: hasPermission = role.CanDeleteModule; break;

                // ? Lesson
                case Permissions.LessonCreate: hasPermission = role.CanCreateLesson; break;
                case Permissions.LessonUpdate: hasPermission = role.CanUpdateLesson; break;
                case Permissions.LessonDelete: hasPermission = role.CanDeleteLesson; break;

                // ? Material
                case Permissions.MaterialCreate: hasPermission = role.CanCreateMaterial; break;
                case Permissions.MaterialUpdate: hasPermission = role.CanUpdateMaterial; break;
                case Permissions.MaterialDelete: hasPermission = role.CanDeleteMaterial; break;

                // ? Admin
                case Permissions.AssignTeacherToCource: hasPermission = role.CanAssignTeacherToCource; break;
                case Permissions.AssignModuleToCource: hasPermission = role.CanAssignModuleToCource; break;
                case Permissions.AssignLessonToModule: hasPermission = role.CanAssignLessonToModule; break;
                case Permissions.AssignMaterialToLesson: hasPermission = role.CanAssignMaterialToLesson; break;
                case Permissions.UnassignTeacherFromCource: hasPermission = role.CanUnassignTeacherFromCource; break;
                case Permissions.UnassignModuleFromCource: hasPermission = role.CanUnassignModuleFromCource; break;
                case Permissions.UnassignLessonFromModule: hasPermission = role.CanUnassignLessonFromModule; break;
                case Permissions.UnassignMaterialFromLesson: hasPermission = role.CanUnassignMaterialFromLesson; break;
                // * Promocode
                case Permissions.GetPromocodes: hasPermission = role.CanGetPromocodes; break;
                case Permissions.CreatePromocode: hasPermission = role.CanCreatePromocode; break;
                case Permissions.UpdatePromocode: hasPermission = role.CanUpdatePromocode; break;
                case Permissions.DeletePromocode: hasPermission = role.CanDeletePromocode; break;
                // * User management
                case Permissions.GetUser: hasPermission = role.CanGetUser; break;
                case Permissions.GetAllUsers: hasPermission = role.CanGetAllUsers; break;
                case Permissions.CreateUser: hasPermission = role.CanCreateUser; break;
                case Permissions.UpdateUser: hasPermission = role.CanUpdateUser; break;
                case Permissions.DeleteUser: hasPermission = role.CanDeleteUser; break;

                // ? Dashboard
                case Permissions.GetTotalUsers: hasPermission = role.CanGetTotalUsers; break;

                // ? Mentor & Submissions
                case Permissions.SendSubmissionFeedback: hasPermission = role.CanSendSubmissionFeedback; break;
                case Permissions.RequestSubmissionRevision: hasPermission = role.CanRequestSubmissionRevision; break;
                case Permissions.GetMentorsCoursesStats: hasPermission = role.CanGetMentorsCoursesStats; break;
                case Permissions.GetMentorsSubmissionsStats: hasPermission = role.CanGetMentorsSubmissionsStats; break;

                default:
                    hasPermission = false;
                    break;
            }

            if (hasPermission)
            { context.Succeed(requirement); }
        }
    }
}
