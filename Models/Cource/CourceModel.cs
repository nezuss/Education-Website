namespace Backend.Models.Cource
{
    public class CourceModel
    {
        public string Id { get; set; }
        public string BannerUrl { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public Double Price { get; set; }
        public string[]? ModulesId { get; set; }

        public DateTime UpdatedAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
