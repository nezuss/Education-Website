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

            AuthorizeServices(builder.Services);

            var app = builder.Build();

            app.MapControllers();
            app.UsePathBase("/api");
            app.UseAuthentication();
            app.UseAuthorization();

            Run(app);
        }

        private static void AuthorizeServices(IServiceCollection services) {
            services.AddScoped<Backend.Services.Auth.AccountService>();
            services.AddScoped<Backend.Services.Auth.DBService>();
            services.AddScoped<Backend.Services.JWT.JWTService>();
        }

        private static void Run(WebApplication app)
        {
            app.Run();
            Console.WriteLine("Backend started");
        }
    }
}
