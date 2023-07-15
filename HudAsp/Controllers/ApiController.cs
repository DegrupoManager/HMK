using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace HMK_WEB.Controllers
{
    public class ApiController : Controller
    {
        private readonly HttpClient _client;
        private readonly string _apiBaseUrl;

        public ApiController(IHttpClientFactory httpClientFactory, IOptions<ApiSettings> apiSettings)
        {
            _client = httpClientFactory.CreateClient();
            _apiBaseUrl = apiSettings.Value.BaseUrl;
        }

        [HttpGet]
        [Route("api/customer/getCustomerList")]
        public async Task<string> GetCustomerListAsync()
        {
            var request = new HttpRequestMessage(HttpMethod.Get, $"{_apiBaseUrl}/customer/getCustomerList");
            var response = await _client.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            return content;
        }

        //GET Reporte
        [HttpGet]
        [Route("api/PreOrders/getReporte")]
        public async Task<string> GetReporteAsync(ReporteModel model)
        {
            var url = $"{_apiBaseUrl}/PreOrders/getReporte?" +
                      $"FechaInicioEmision={model.FechaInicioEmision}&" +
                      $"FechaFinEmision={model.FechaFinEmision}&" +
                      $"CodAlmacen={model.CodAlmacen}";

            var request = new HttpRequestMessage(HttpMethod.Get, url);
            var response = await _client.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            return content;
        }



    }
}
