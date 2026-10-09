using Backend.Models;
using Backend.Models.Cource.MaterialAnswers;

namespace Backend.Responses.Mentor
{
    public class StudentsLIstResponce
    {
        public string Username { get; set; }
        public string CourceId { get; set; }
        public int Progress { get; set; }
        public string LastActivity { get; set; }
        public int TotalAmountOfWorksOnReview { get; set; }
    }
}
