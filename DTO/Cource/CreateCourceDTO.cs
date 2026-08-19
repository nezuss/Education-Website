namespace Backend.DTO.Cource
{
    public class CreateCourceDTO
    {
        public string BannerUrl { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public Double Price { get; set; }
        public List<string>? ModulesId { get; set; }
        public int TotalLearningPeriodWeeks { get; set; }
        public int ProjectsReadyForPortfolio { get; set; }
    }
}
