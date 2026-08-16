using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models.Cource.Materials
{
    public class AnswerModel
    {
        public string Id { get; set; }
        public string QuestionModelId { get; set; }
        public string Text { get; set; }
        public bool IsCorrect { get; set; }
    }
}
