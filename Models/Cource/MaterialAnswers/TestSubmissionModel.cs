using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models.Cource.MaterialAnswers
{
    public class TestSubmissionModel : MaterialSubmissionModel
    {
        [ForeignKey("TestSubmissionId")]
        public List<TestQuestionAnswerModel> Answers { get; set; } = new List<TestQuestionAnswerModel>();
    }
}

