using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models.Cource.MaterialAnswers
{
    public abstract class MaterialSubmissionModel
    {
        public string Id { get; set; }
        public string RelatedMaterialId { get; set; }
        public string UserId { get; set; }

        public DateTime UpdatedAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
