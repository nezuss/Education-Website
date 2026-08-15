using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;

namespace Backend.Attributes.Auth
{
    public class PermissionPolicyProvider : DefaultAuthorizationPolicyProvider
    {
        public PermissionPolicyProvider(IOptions<AuthorizationOptions> options) : base(options)
        { }

        public override async Task<AuthorizationPolicy?> GetPolicyAsync(string policyName)
        {
            if (policyName.StartsWith(PermissionAttribute.Prefix,
                                      StringComparison.OrdinalIgnoreCase))
            {
                var permission = policyName.Substring(PermissionAttribute.Prefix.Length);

                var policy = new AuthorizationPolicyBuilder()
                    .AddRequirements(new PermissionRequirement(permission))
                    .Build();

                return policy;
            }

            return await base.GetPolicyAsync(policyName);
        }
    }
}
