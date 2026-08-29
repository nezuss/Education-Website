using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models.Cource.MaterialAnswers
{
    public class AssignmentSubmissionModel : MaterialSubmissionModel
    {
        public string FileUrl { get; set; }
    }
}
