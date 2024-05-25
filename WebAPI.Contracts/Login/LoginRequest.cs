namespace WebAPI.Contracts.Login;

using System.ComponentModel.DataAnnotations;

public class LoginRequest
{
    [Required, EmailAddress]
    public string? Email { get; set; }

    [Required, DataType(DataType.Password)]
    public string? Password { get; set; }
}
