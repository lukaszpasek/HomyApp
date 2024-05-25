namespace WebAPI.Contracts.Accounts;

using System.Collections.Generic;

public class RegisterResponse
{
    public bool Success { get; set; }
    public IEnumerable<string>? Errors { get; set; }
}
