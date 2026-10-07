using Backend.Models;
using Backend.Models.Cource.MaterialAnswers;

namespace Backend.Responses.Mentor
{
    public class SubmissionsResponse
    {
        public StudentModel Student { get; set; }
        public List<MaterialSubmissionModel> Submissions { get; set; } = new List<MaterialSubmissionModel>();
    }

    public class StudentModel
    {
        public string Id { get; set; }
        public string CourceId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
    }
}
