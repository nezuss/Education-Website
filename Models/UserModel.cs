namespace Backend.Models {
    public class UserModel {
        public string Id { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string AuthorizedKeyId { get; set; }
        public string Salt { get; set; }
        public string? RoleId { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
