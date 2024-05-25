using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.Domain;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products.ToListAsync();
        }

        // POST: api/Products
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            product.AddDateTime = DateTime.Now;
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return Ok(product);
        }

        [HttpGet("{barcode}")]
        public async Task<ActionResult<Product>> GetProduct(string barcode)
        {
            var product = await _context.Products.FirstOrDefaultAsync(c => c.Barcode == barcode);

            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }
        [HttpGet("User/{userId}")]
        public async Task<ActionResult<IEnumerable<Product>>> GetProductsByUserId(int userId)
        {
            var products = await _context.Products
                .Where(p => p.UserId == userId)
                .Include(p => p.User)
                .ToListAsync();

            if (products == null || !products.Any())
            {
                return NotFound();
            }

            return Ok(products);
        }
    }
}
