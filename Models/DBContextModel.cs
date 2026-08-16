using Microsoft.EntityFrameworkCore;
using Backend.Models.Cource;
using Backend.Models.Cource.Materials;

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
        public DbSet<QuestionModel> Questions { get; set; }
        public DbSet<AnswerModel> Answers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<MaterialModel>()
                .HasDiscriminator<string>("Type")
                .HasValue<FileMaterialModel>("File")
                .HasValue<TextMaterialModel>("Text")
                .HasValue<AssignmentMaterialModel>("Assignment")
                .HasValue<VideoMaterialModel>("Video")
                .HasValue<LinkMaterialModel>("Link")
                .HasValue<TestMaterialModel>("Test");
        }
    }
}
