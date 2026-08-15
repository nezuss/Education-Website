namespace Backend.DTO.Cource
{
    public class CreateLessonDTO
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public List<string>? MaterialsId { get; set; }
    }
}
