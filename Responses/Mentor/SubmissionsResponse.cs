using Backend.Models;
using Backend.Responses.Cource;

namespace Backend.Responses.Mentor
{
    public class SubmissionsResponse
    {
        public StudentModel Student { get; set; }
        public List<SubmissionResponse> Submissions { get; set; } = new List<SubmissionResponse>();
    }

    public class StudentModel
    {
        public string Id { get; set; }
        public string CourceId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
    }
}
