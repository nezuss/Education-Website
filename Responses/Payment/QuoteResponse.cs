namespace Backend.Responses.Payment
{
    public class QuoteResponse
    {
        public string CourseId { get; set; }
        public string CourseTitle { get; set; }
        public string? Promocode { get; set; }
        public decimal DiscountPercent { get; set; }

        // ? Amounts in minor units (15000 = 150.00 UAH)
        public long OriginalAmountMinor { get; set; }
        public long DiscountAmountMinor { get; set; }
        public long TotalAmountMinor { get; set; }
        public string Currency { get; set; }
    }
}
