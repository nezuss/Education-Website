namespace Backend.Responses.Profile
{
    public class PublicProfileResponse
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public string Role { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? AvatarUrl { get; set; }
        public string? Bio { get; set; }
    }
}
