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

                default:
                    hasPermission = false;
                    break;
            }

            if (hasPermission)
            { context.Succeed(requirement); }
        }
    }
}
