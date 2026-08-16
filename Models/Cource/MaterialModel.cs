namespace Backend.Models.Cource
{
    public abstract class MaterialModel
    {
        public string Id { get; set; }
        public string Type { get; set; }

        public DateTime UpdatedAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
