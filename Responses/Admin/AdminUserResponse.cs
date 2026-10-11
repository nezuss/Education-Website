namespace Backend.Responses.Admin
{
    public class AdminUserResponse
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string? RoleId { get; set; }
        public string RoleName { get; set; }
        public bool IsEmailConfirmed { get; set; }
        public List<string> EnrolledCourcesId { get; set; } = new List<string>();
        public string? AvatarUrl { get; set; }
        public string? Bio { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
