namespace Backend.Models.Order
{
    public class OrderModel
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string CourseId { get; set; }

        // ? Amounts in minor units (15000 = 150.00 UAH)
        public long AmountMinor { get; set; }
        public long OriginalAmountMinor { get; set; }
        public long DiscountAmountMinor { get; set; }
        public string Currency { get; set; } = "uah";
        public string? Promocode { get; set; }

        public string Status { get; set; } = OrderStatus.Pending;
        public string? StripeSessionId { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? PaidAt { get; set; }
    }

    public static class OrderStatus
    {
        public const string Pending = "Pending";
        public const string Paid = "Paid";
        public const string Failed = "Failed";
        public const string Cancelled = "Cancelled";
    }
}
