using Backend.Models.Cource.MaterialAnswers;
using Backend.Models.Cource;

namespace Backend.Responses.Profile
{
    public class UserStatsResponse
    {
        public List<CourceModel> Cources { get; set; }
        public List<MaterialSubmissionModel> Submissions { get; set; }
    }
}
