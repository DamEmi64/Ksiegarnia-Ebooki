using Copyleaks.SDK.V3.API;
using Copyleaks.SDK.V3.API.Exceptions;
using Copyleaks.SDK.V3.API.Models.Callbacks;
using Copyleaks.SDK.V3.API.Models.Requests;
using Copyleaks.SDK.V3.API.Models.Requests.Properties;
using Copyleaks.SDK.V3.API.Models.Responses;
using Copyleaks.SDK.V3.API.Models.Types;
using Infrastructure.Services.Interfaces;
using Newtonsoft.Json;

namespace Infrastructure.Services.PlagiatSystem
{
    public class CopyLeaksService : ICopyLeaksService
    {
        private CopyleaksScansApi _APIClient { get; set; }
        private CopyleaksIdentityApi _IdentityClient { get; set; }

        public CopyLeaksService()
        {
            Task.Run(async () => await Login());
        }

        public async Task Submit(byte[] content)
        {
            string scanId = Guid.NewGuid().ToString();
            var response = new CopyLeaksResponse()
            {
                ScanId = scanId,
                Token = ConfigurationConst.CopyLeaksToken
            };

            try
            {
                using (var api = new CopyleaksScansApi())
                {
                    // Submit a file for scan in https://api.copyleaks.com
                    await api.SubmitFileAsync(scanId, new FileDocument
                    {
                        // The text to scan in base64 format
                        Base64 = Convert.ToBase64String(content),
                        // The file name is it will appear in the scan result
                        Filename = "text.txt",
                        PropertiesSection = GetScanProperties(scanId)
                    },
                    ConfigurationConst.CopyLeaksToken).ConfigureAwait(false);
                }
                var checkResult = new CopyLeaksResultResponse
                {
                    ScanId = scanId
                };

            }
            catch (CopyleaksHttpException cfe)
            {
                throw new Exception(cfe.Message);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public CopyLeaksResultResponse GetResult(string scanId)
        {
            return new CopyLeaksResultResponse()
            {
                ScanId = scanId,
                CompletedCallback = GetResultFromFile(scanId)
            };
        }

        public void SaveResults(CompletedCallback completedCallback, string scanId)
        {
            string json = JsonConvert.SerializeObject(completedCallback);
            string resultFilePath = $".\\Copyleaks\\{scanId}.json";

            File.WriteAllText(resultFilePath, json);
        }

        private async Task Login()
        {
            var response = new LoginResponse();
            try
            {
                // Use CopyleaksIdentityApi to aquire a login Token from 
                Guid temp;
                var validOrEmptyKey = Guid.TryParse(ConfigurationConst.CopyLeaksAPIKey, out temp) ? ConfigurationConst.CopyLeaksAPIKey : Guid.Empty.ToString();

                // Request an API token from https://id.copyleaks.com/
                var loginResponse = await _IdentityClient.LoginAsync(ConfigurationConst.Email, validOrEmptyKey).ConfigureAwait(false);

                var clientApi = _APIClient;
                var clientCredits = await clientApi.CreditBalanceAsync(loginResponse.Token).ConfigureAwait(false);

                var submitResponse = new CopyLeaksResponse()
                {
                    Token = loginResponse.Token,
                    ClientCredits = clientCredits,
                };

            }
            catch (CopyleaksHttpException cfe)
            {
                throw new Exception(cfe.Message);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        #region Helpers

        private ScanProperties GetScanProperties(string scanId)
        {
            ScanProperties scanProperties = new ClientScanProperties();

            // The action to perform
            // Possible values:
            // 1. checkCredits - return the number of credits that will be consumed by the scan.
            //                   The Result of the request will be returned to the 'Completion' callback
            // 2. Scan - Scan the submitted text
            //           The Result of the request will be returned to the 'Completion' callback
            // 3. Index - Upload the submitted text to Copyleaks internal database to be compared against feture scans
            //            The Result of the request will be returned to the 'Completion' callback
            scanProperties.Action = eSubmitAction.Scan;
            scanProperties.Webhooks = new Webhooks
            {
                // Copyleaks API will POST the scan results to the 'completed' callback
                // See 'CompletedProcess' method for more details
                Status = new Uri($"{ConfigurationConst.WebHookHost}/{scanId}/{{status}}")
            };
            // Sandbox mode does not take any credits
            scanProperties.Sandbox = false;

            return scanProperties;
        }

        private CompletedCallback GetResultFromFile(string scanId)
        {
            if (File.Exists($".\\Copyleaks\\{scanId}.json"))
            {
                string path = $".\\Copyleaks\\{scanId}.json";
                var json = File.ReadAllText(path);
                return JsonConvert.DeserializeObject<CompletedCallback>(json);
            }
            else
                return null;
        }

        #endregion
    }
}
