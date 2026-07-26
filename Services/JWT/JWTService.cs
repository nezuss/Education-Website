using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Globalization;
using Backend.Models;

namespace Backend.Services.JWT
{
    public class JWTService {
        private readonly IConfiguration _iConfiguration;
        private readonly string _secretKey;
        private readonly string _issuer;

        public JWTService(IConfiguration iConfiguration)
        {
            _iConfiguration = iConfiguration;
            _secretKey = _iConfiguration["JWT:SecretKey"];
            _issuer = _iConfiguration["JWT:Issuer"];
        }

        public string GenerateToken(UserModel user, string KeyId)
        {
            var accessToken = GenerateAccessToken(user, KeyId);

            return accessToken;
        }

        private string GenerateAccessToken(UserModel user, string KeyId)
        {
            var now = DateTime.UtcNow;

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim("email", user.Email),
                new Claim("kid", KeyId),
                new Claim(JwtRegisteredClaimNames.Iat, EpochTime.GetIntDate(now).ToString(CultureInfo.InvariantCulture), ClaimValueTypes.Integer64)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                _issuer,
                _issuer,
                claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            if (string.IsNullOrWhiteSpace(token) || token.Split('.').Length != 3)
            {
                throw new SecurityTokenMalformedException("JWT must have three segments (JWS).");
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = securityKey,
                ClockSkew = TimeSpan.Zero
            };

            try
            {
                var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var validatedToken);
                return principal;
            }
            catch (SecurityTokenException ex)
            {
                throw new SecurityTokenMalformedException("Invalid JWT token format or signature.", ex);
            }
        }
    }
}
