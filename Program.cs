using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Backend.Models;
using Backend.Attributes.Auth;

namespace Backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();

            builder.Services.AddAuthentication();
            builder.Services.AddAuthorization();

            builder.Services.AddMemoryCache();

            ConfigureAuthentication(builder);
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
            app.MapControllers();
            app.UsePathBase("/api");
            app.UseAuthentication();
            app.UseAuthorization();

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
            });
        }

        private static void AuthorizeServices(IServiceCollection services)
        {
            services.AddScoped<Backend.Services.Cource.CourcesService>();
            services.AddScoped<Backend.Services.Cource.ModuleService>();
            services.AddScoped<Backend.Services.Cource.LessonService>();
            services.AddScoped<Backend.Services.Cource.MaterialService>();
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
