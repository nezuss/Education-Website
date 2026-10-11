namespace Backend.Responses.Order
{
    public class AdminOrdersResponse
    {
        public List<AdminOrderResponse> Items { get; set; } = new List<AdminOrderResponse>();
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public AdminOrdersSummaryResponse Summary { get; set; } = new AdminOrdersSummaryResponse();
    }

    public class AdminOrderResponse : OrderResponse
    {
        public string UserId { get; set; }
        public string? Username { get; set; }
        public string? UserEmail { get; set; }
        public string? StripeSessionId { get; set; }
    }

    // ? Revenue breakdown across all orders (not affected by status filter / pagination)
    public class AdminOrdersSummaryResponse
    {
        public long TotalRevenueMinor { get; set; }
        public long TotalDiscountMinor { get; set; }
        public string Currency { get; set; } = "uah";
        public int TotalOrders { get; set; }
        public int PaidCount { get; set; }
        public int PendingCount { get; set; }
        public int FailedCount { get; set; }
        public int CancelledCount { get; set; }
    }
}
