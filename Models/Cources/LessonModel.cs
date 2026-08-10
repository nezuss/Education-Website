namespace Backend.Models.Cources
{
    public class LessonModel
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string[] MaterialsId { get; set; }
    }
}
