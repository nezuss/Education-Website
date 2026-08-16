using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models.Cource.Materials
{
    public class QuestionModel
    {
        public string Id { get; set; }
        public string TestMaterialModelId { get; set; }
        public string Text { get; set; }
        public List<AnswerModel> Answers { get; set; } = new List<AnswerModel>();
    }
}
