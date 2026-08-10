using Microsoft.EntityFrameworkCore;
using Backend.Models.Cources;

namespace Backend.Models
{
    public class DBContextModel : DbContext
    {
        public DBContextModel(DbContextOptions<DBContextModel> options) : base(options) { }

        // ? Users
        public DbSet<UserModel> Users { get; set; }
        public DbSet<RoleModel> Roles { get; set; }

        // ? Cources
        public DbSet<CourceModel> Cources { get; set; }
        public DbSet<ModuleModel> Modules { get; set; }
        public DbSet<LessonModel> Lessons { get; set; }
        public DbSet<MaterialModel> Materials { get; set; }
    }
}
