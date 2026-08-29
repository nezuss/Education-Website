using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Backend.Models.Cource.MaterialAnswers
{
    public class TestQuestionAnswerModel
    {
        public string Id { get; set; }
        public string QuestionId { get; set; }
        public string AnswerId { get; set; }
        public string TestSubmissionId { get; set; }
    }
}
