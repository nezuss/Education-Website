namespace Backend.DTO.Cource
{
    public class UpdateMoudleDTO
    {
        public string Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public List<string>? LessonsId { get; set; }
    }
}
