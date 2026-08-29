namespace Backend.DTO.Cource.MaterialAnswers
{
    public class SubmitTestAnswerDTO
    {
        public string TestId { get; set; }
        public List<TestQuestionAnswerDTO> Answers { get; set; }
    }

    public class TestQuestionAnswerDTO
    {
        public string QuestionId { get; set; }
        public string AnswerId { get; set; }
    }
}
