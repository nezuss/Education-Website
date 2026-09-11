namespace Backend.DTO.Cource
{
    public class CourceStatsDTO
    {
        public string CourceId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public double ProgressPercentage { get; set; }
        public int TotalModules { get; set; }
        public int CompletedModules { get; set; }
        public int TotalLessons { get; set; }
        public int CompletedLessons { get; set; }
        public int TotalMaterials { get; set; }
        public int TotalSubmittableMaterials { get; set; }
        public int CompletedSubmittableMaterials { get; set; }
    }
}
