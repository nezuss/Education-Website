namespace Backend.DTO.Cource.Promocode
{
    public class UpdatePromocodeDTO
    {
        public string Promocode { get; set; } = string.Empty;
        public decimal Discount { get; set; }
        public DateTime WillExpireAt { get; set; }
    }
}
