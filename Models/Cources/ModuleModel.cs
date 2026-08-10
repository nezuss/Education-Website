namespace Backend.Models.Cources
{
    public class ModuleModel
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string[] LessonsId { get; set; }
    }
}
