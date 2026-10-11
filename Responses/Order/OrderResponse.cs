namespace Backend.Responses.Order
{
    public class OrderResponse
    {
        public string Id { get; set; }
        public string CourseId { get; set; }
        public string? CourseTitle { get; set; }

        // ? Amounts in minor units (15000 = 150.00 UAH)
        public long AmountMinor { get; set; }
        public long OriginalAmountMinor { get; set; }
        public long DiscountAmountMinor { get; set; }
        public string Currency { get; set; }
        public string? Promocode { get; set; }

        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? PaidAt { get; set; }
    }

    public class OrdersPageResponse
    {
        public List<OrderResponse> Items { get; set; } = new List<OrderResponse>();
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
    }
}
