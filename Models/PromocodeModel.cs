namespace Backend.Models
{
    public class PromocodeModel
    {
        public string Promocode { get; set; }
        public decimal? Discount { get; set; }
        public DateTime WillExpireAt { get; set; }
    }
}
