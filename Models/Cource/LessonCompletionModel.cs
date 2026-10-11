namespace Backend.Models.Cource
{
    public class LessonCompletionModel
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string LessonId { get; set; }
        public string CourseId { get; set; }
        public DateTime CompletedAt { get; set; }
    }
}
