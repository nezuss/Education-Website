using Microsoft.EntityFrameworkCore;

namespace Backend.Models
{
    public class DBContextModel : DbContext
    {
        public DBContextModel(DbContextOptions<DBContextModel> options) : base(options) { }
        public DbSet<UserModel> Users { get; set; }
        public DbSet<RoleModel> Roles { get; set; }
    }
}
