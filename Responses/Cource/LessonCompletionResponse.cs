namespace Backend.Responses.Cource
{
    public class LessonCompletionResponse
    {
        public string Id { get; set; }
        public string LessonId { get; set; }
        public string CourseId { get; set; }
        public DateTime CompletedAt { get; set; }
        public bool AlreadyCompleted { get; set; }
    }
}
