namespace Backend.Models
{
    public class RoleModel
    {
        public string Id { get; set; }
        public string Name { get; set; }

        // ? Course
        public bool CanCreateCourse { get; set; }
        public bool CanUpdateCourse { get; set; }
        public bool CanDeleteCourse { get; set; }

        // ? Module
        public bool CanCreateModule { get; set; }
        public bool CanUpdateModule { get; set; }
        public bool CanDeleteModule { get; set; }

        // ? Lesson
        public bool CanCreateLesson { get; set; }
        public bool CanUpdateLesson { get; set; }
        public bool CanDeleteLesson { get; set; }

        // ? Material
        public bool CanCreateMaterial { get; set; }
        public bool CanUpdateMaterial { get; set; }
        public bool CanDeleteMaterial { get; set; }

        // ? Dashboard
        public bool CanGetTotalUsers { get; set; }

        public DateTime UpdatedAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
