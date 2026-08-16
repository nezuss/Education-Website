namespace Backend.DTO.Cource
{
    public class CreateMaterialDTO
    {
        public string Type { get; set; }

        public string? FileUrl { get; set; }
        public string? Content { get; set; }
        public string? Description { get; set; }
        public DateTime? Deadline { get; set; }

        public string? VideoUrl { get; set; }
        public string? Url { get; set; }
        public string? LinkTitle { get; set; }

        public List<CreateQuestionDTO>? Questions { get; set; }
    }

    public class CreateQuestionDTO
    {
        public string Text { get; set; }
        public List<CreateAnswerDTO> Answers { get; set; } = new List<CreateAnswerDTO>();
    }

    public class CreateAnswerDTO
    {
        public string Text { get; set; }
        public bool IsCorrect { get; set; }
    }
}
