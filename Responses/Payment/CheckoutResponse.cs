namespace Backend.Responses.Payment
{
    public class CheckoutResponse
    {
        public string OrderId { get; set; }
        public string Status { get; set; }
        public bool IsEnrolled { get; set; }
        public string? CheckoutUrl { get; set; }

        // ? Amounts in minor units (15000 = 150.00 UAH)
        public long OriginalAmountMinor { get; set; }
        public long DiscountAmountMinor { get; set; }
        public long TotalAmountMinor { get; set; }
        public string Currency { get; set; }
    }
}
