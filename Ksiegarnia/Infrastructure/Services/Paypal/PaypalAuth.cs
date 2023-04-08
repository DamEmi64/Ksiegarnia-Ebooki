using PayPal.Api;

namespace Infrastructure.Services.Paypal
{
    partial class PaypalService
    {
        public string GetAccessToken()
        {
            var paypalConfig = ConfigurationConst.Paypal;
            return new OAuthTokenCredential(paypalConfig.ClientId, paypalConfig.ClientSecret,GetConfig()).GetAccessToken();
        }

        public APIContext GetAPIContext(string accessToken)
        {
            var apiContext = new APIContext(accessToken);
            apiContext.Config = GetConfig();
            return apiContext;
        }

        private Dictionary<string, string> GetConfig()
        {
            return new Dictionary<string, string>()
                    {
                        {"mode",ConfigurationConst.Paypal.Mode }
                    };
        }
    }
}
