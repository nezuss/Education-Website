namespace Backend.DTO.Cource
{
    public class CreateModuleDTO
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public List<string>? LessonsId { get; set; }
    }
}
