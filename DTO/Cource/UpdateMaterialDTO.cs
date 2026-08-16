namespace Backend.DTO.Cource
{
    public class UpdateMaterialDTO
    {
        public string Id { get; set; }
        public string? FileUrl { get; set; }
        public string? Content { get; set; }
        public string? Description { get; set; }
        public DateTime? Deadline { get; set; }
        
        public string? VideoUrl { get; set; }
        public string? Url { get; set; }
        public string? LinkTitle { get; set; }
        
        public List<CreateQuestionDTO>? Questions { get; set; }
    }
}
