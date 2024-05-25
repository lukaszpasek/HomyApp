using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Contracts.Accounts;
using WebAPI.Data;
using RegisterRequest = WebAPI.Contracts.Accounts.RegisterRequest;
using Microsoft.EntityFrameworkCore;
using WebAPI.Domain;
using Microsoft.AspNetCore.Authorization;
using static System.Net.Mime.MediaTypeNames;
using System.Security.Claims;

namespace WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AccountsController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;

    public AccountsController(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    [HttpPost]
    public async Task<IActionResult> CreateAccount([FromBody] RegisterRequest model)
    {
        var user = new ApplicationUser
        {
            UserName = model.Email,
            Email = model.Email
        };

        var result = await _userManager.CreateAsync(user, model.Password!);

        if (!result.Succeeded)
        {
            return BadRequest(new RegisterResponse { Success = false, Errors = result.Errors.Select(x => x.Description) });
        }

        return Ok(new RegisterResponse { Success = true });
    }
    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<ApplicationUser>>> GetAccount()
    {
        
        
        string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized();
        }

        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return NotFound();
        }

        return Ok(new List<ApplicationUser> { user });
    }
}