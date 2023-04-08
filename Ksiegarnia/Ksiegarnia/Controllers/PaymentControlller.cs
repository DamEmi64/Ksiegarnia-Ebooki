using Microsoft.AspNetCore.Mvc;

namespace Application.Controllers
{
    public class PaymentControlller : Controller
    {
        IConfiguration _configuration;

        public PaymentControlller(IConfiguration configuration)
        {
            _configuration = configuration;
        }


/*        public Task<IActionResult> Payment(string cancel, string payerId)
        {
            var clientKey = _configuration.GetValue<string>("PaypalKey");
            var clientSecret = _configuration.GetValue<string>("Paypal");
        }*/
    }
}
