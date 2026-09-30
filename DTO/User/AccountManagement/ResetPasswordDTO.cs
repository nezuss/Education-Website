namespace Backend.DTO.User.AccountManagement
{
    public class ResetPasswordDTO
    {
        public string ResetToken { get; set; }
        public string Password { get; set; }
    }
}
