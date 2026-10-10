namespace Backend.Responses.Cource
{
    public class SubmissionResponse
    {
        public string Id { get; set; }
        public string Type { get; set; }
        public string MaterialId { get; set; }
        public string UserId { get; set; }
        public int Rate { get; set; }
        public string? Status { get; set; }
        public string? Feedback { get; set; }
        public string? RevisionMessage { get; set; }

        // ? Context
        public string? CourseId { get; set; }
        public string? CourseTitle { get; set; }
        public string? LessonId { get; set; }
        public string? LessonTitle { get; set; }

        // ? Assignment / Test data
        public string? FileUrl { get; set; }
        public List<SubmissionAnswerResponse>? Answers { get; set; }

        // ? Mentor Info
        public string? ReviewerId { get; set; }
        public string? ReviewerName { get; set; }
        public string? ReviewerAvatarUrl { get; set; }
        public DateTime? ReviewerAt { get; set; }

        public DateTime SubmittedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class SubmissionAnswerResponse
    {
        public string QuestionId { get; set; }
        public string AnswerId { get; set; }
    }
}
