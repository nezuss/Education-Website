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

        public DateTime UpdatedAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
