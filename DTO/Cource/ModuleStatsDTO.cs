namespace Backend.DTO.Cource
{
    public class ModuleStatsDTO
    {
        public string ModuleId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public double ProgressPercentage { get; set; }
        public int TotalLessons { get; set; }
        public int CompletedLessons { get; set; }
        public int TotalMaterials { get; set; }
        public int TotalSubmittableMaterials { get; set; }
        public int CompletedSubmittableMaterials { get; set; }
    }
}
