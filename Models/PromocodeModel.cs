using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class PromocodeModel
    {
        [Key]
        public string Promocode { get; set; }
        public decimal? Discount { get; set; }
        public DateTime WillExpireAt { get; set; }
    }
}
