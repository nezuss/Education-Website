using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Backend.Models;
using Backend.Services.Auth;
using Backend.Attributes.Auth;
using System.Security.Claims;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.JsonWebTokens;
using System.IdentityModel.Tokens.Jwt;

namespace Backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();

            // ? Auth
            ConfigureAuthentication(builder);
            builder.Services.AddAuthorization();
            builder.Services.AddAuthentication();

            builder.Services.AddMemoryCache();

            // ? Other
            AuthorizeServices(builder.Services);
            ConnectDatabase(builder);

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", builder =>
                {
                    builder.AllowAnyOrigin()
                           .AllowAnyMethod()
                           .AllowAnyHeader();
                });
            });

            var app = builder.Build();

            ConfigureStaticFiles(app, builder);

            app.UseCors("AllowAll");
            app.UsePathBase("/api");
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();

            Run(app);
        }

        private static void ConnectDatabase(WebApplicationBuilder builder)
        {
            builder.Services.AddDbContext<DBContextModel>(options =>
            {
                options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
            });
        }

        private static void ConfigureAuthentication(WebApplicationBuilder builder)
        {
            var jwtSettings = builder.Configuration.GetSection("JWT");
            var key = Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]);

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateIssuerSigningKey = true,
                    ClockSkew = TimeSpan.Zero,
                    ValidIssuer = jwtSettings["Issuer"],
                    ValidAudience = jwtSettings["Issuer"],
                    IssuerSigningKey = new SymmetricSecurityKey(key)
                };

                options.Events = new JwtBearerEvents
                {
                    OnTokenValidated = async context =>
                    {
                        string? kid = context.Principal?.FindFirst("kid")?.Value;
                        var userId = context.Principal?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                        if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(kid))
                        {
                            context.Fail("UserId or Kid is missing.");
                            return;
                        }

                        var userService = context.HttpContext.RequestServices.GetRequiredService<UserService>();
                        var user = await userService.GetUserByIdAsync(userId);

                        if (user == null || user.AuthorizedKeyId.ToString() != kid)
                        { context.Fail("Invalid kid"); }
                    }
                };
            });
        }

        private static void AuthorizeServices(IServiceCollection services)
        {
            services.AddScoped<Backend.Services.Cource.CourcesService>();
            services.AddScoped<Backend.Services.Cource.ModuleService>();
            services.AddScoped<Backend.Services.Cource.LessonService>();
            services.AddScoped<Backend.Services.Cource.MaterialService>();
            services.AddScoped<Backend.Services.Stats.UsersStatsService>();
            services.AddScoped<Backend.Services.Profile.PublicProfileService>();
            services.AddScoped<Backend.Services.Auth.UserService>();
            services.AddScoped<Backend.Services.Auth.DBService>();
            services.AddScoped<Backend.Services.JWT.JWTService>();
            services.AddSingleton<IAuthorizationPolicyProvider, PermissionPolicyProvider>();
            services.AddScoped<IAuthorizationHandler, PermissionAuthorizationHandler>();
        }

        private static void ConfigureStaticFiles(WebApplication app, WebApplicationBuilder builder)
        {
            var uploadsPath = Path.Combine(builder.Environment.WebRootPath ?? Path.Combine(builder.Environment.ContentRootPath, "wwwroot"), "uploads");
            if (!Directory.Exists(uploadsPath))
            { Directory.CreateDirectory(uploadsPath); }

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(uploadsPath),
                RequestPath = "/api/uploads"
            });
            app.UseStaticFiles();
        }

        private static void Run(WebApplication app)
        {
            app.Run();
            Console.WriteLine("Backend started");
        }
    }
}
