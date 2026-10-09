using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models.Cource.MaterialAnswers
{
    public abstract class MaterialSubmissionModel
    {
        public string Id { get; set; }
        public string Type { get; set; }
        public string RelatedMaterialId { get; set; }
        public string UserId { get; set; }
        public int Rate { get; set; }
        public string? Status { get; set; }
        public string? Feedback { get; set; }
        public string? RevisionMessage { get; set; }

        public DateTime SubmittedAt { get; set; }
      
        // ? Mentor Info
        public string ReviewerId { get; set; }
        public string ReviewerName { get; set; }
        public string ReviewerAvatarUrl { get; set; }
        public DateTime ReviewerAt { get; set; }
        
        public DateTime UpdatedAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
