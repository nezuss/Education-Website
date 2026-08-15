using Microsoft.AspNetCore.Authorization;

namespace Backend.Attributes.Auth
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public sealed class PermissionAttribute : AuthorizeAttribute
    {
        public const string Prefix = "Permission:";

        public PermissionAttribute(string permission)
        {
            Policy = Prefix + permission;
        }
    }
}
