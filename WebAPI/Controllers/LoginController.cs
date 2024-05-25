using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using WebAPI.Contracts.Login;
using WebAPI.Data;

namespace WebAPI.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public LoginController(IConfiguration configuration, SignInManager<ApplicationUser> signInManager)
        {
            _configuration = configuration;
            _signInManager = signInManager;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginRequest login)
        {
            var result = await _signInManager.PasswordSignInAsync(login.Email!, login.Password!, false, false);

            if (!result.Succeeded)
            {
                return BadRequest(new LoginResponse { Success = false, Error = "Username and password are icnorrect" });
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, login.Email!),
                new Claim(ClaimTypes.NameIdentifier, User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSecurityKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);
            var expiry = DateTime.UtcNow.AddDays(Convert.ToInt32(_configuration["JwtExpireInDays"]));

            var token = new JwtSecurityToken(
                _configuration["JwtIssuer"],
                _configuration["JwtAudience"],
                claims,
                expires: expiry,
                signingCredentials: creds);

            return Ok(new LoginResponse { Success = true, Token = new JwtSecurityTokenHandler().WriteToken(token) });
        }
    }

}
