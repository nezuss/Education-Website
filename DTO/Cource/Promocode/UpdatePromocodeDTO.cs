namespace Backend.DTO.Cource
{
    public class UpdatePromocodeDTO
    {
        public string Promocode { get; set; } = string.Empty;
        public string Discount { get; set; } = string.Empty;
        public DateTime WillExpireAt { get; set; }
    }
}
