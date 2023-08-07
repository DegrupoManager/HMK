using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace HMK_WEB.Controllers
{
    public class ApiController : Controller
    {
        private readonly HttpClient _client;
        private readonly string _apiBaseUrl;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ApiController(IHttpClientFactory httpClientFactory, IOptions<ApiSettings> apiSettings, IHttpContextAccessor httpContextAccessor)
        {
            _client = httpClientFactory.CreateClient();
            _apiBaseUrl = apiSettings.Value.BaseUrl;
            _httpContextAccessor = httpContextAccessor;
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
        public async Task<IActionResult> GetReporteAsync(ReporteModel model)
        {
            if (Request.Cookies.TryGetValue("Rol", out var rol) && (rol == "Revisor" || rol == "Editor" || rol == "Administrador"))
            {
                var actionCode = "006";
                var isAllowed = await GetRoleCodeComparisonAsync(actionCode);

                if (isAllowed)
                {
                    var url = $"{_apiBaseUrl}/PreOrders/getReporte?" +
                              $"FechaInicioEmision={model.FechaInicioEmision}&" +
                              $"FechaFinEmision={model.FechaFinEmision}&" +
                              $"CodAlmacen={model.CodAlmacen}";

                    var request = new HttpRequestMessage(HttpMethod.Get, url);
                    var response = await _client.SendAsync(request);

                    if (response.IsSuccessStatusCode)
                    {
                        var content = await response.Content.ReadAsStringAsync();
                        return Ok(content);
                    }
                    else
                    {
                        return Ok("");
                    }
                }
                else
                {
                    return Ok("");
                }
            }
            else
            {
                return Ok("");
            }
        }

        public async Task<string> GetListaRolesAsync()
        {
            var url = $"{_apiBaseUrl}/Rolls/list";


            var request = new HttpRequestMessage(HttpMethod.Get, url);
            var response = await _client.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            return content;
        }

        public async Task<string> GetRolesActionAsync(string id)
        {
            var url = $"{_apiBaseUrl}/Rolls/actionsByRoll?id={id}";


            var request = new HttpRequestMessage(HttpMethod.Get, url);
            var response = await _client.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            return content;

        }

        public async Task<bool> GetRoleCodeComparisonAsync(string actionCode)
        {
            var rolesListResponse = await GetListaRolesAsync();
            var rolesList = JsonConvert.DeserializeObject<List<ResponseRolesModel>>(rolesListResponse);

            var cookieRol = _httpContextAccessor.HttpContext.Request.Cookies["Rol"];

            foreach (var role in rolesList)
            {
                if (role.Descripcion == cookieRol)
                {
                    var codRol = role.Codigo;
                    var AccionesResponse = await GetRolesActionAsync(codRol);

                    var AccionesList = JsonConvert.DeserializeObject<List<ResponseRolesModel>>(AccionesResponse);

                    foreach (var accion in AccionesList)
                    {
                        if (accion.Codigo == actionCode)
                        {
                            return true;
                        }
                    }

                }
            }

            return false;
        }

        //[HttpGet]
        //[Route("api/PreOrders/getReporte")]
        //public async Task<string> GetReporteAsync(ReporteModel model)
        //{
        //    var url = $"{_apiBaseUrl}/PreOrders/getReporte?" +
        //              $"FechaInicioEmision={model.FechaInicioEmision}&" +
        //              $"FechaFinEmision={model.FechaFinEmision}&" +
        //              $"CodAlmacen={model.CodAlmacen}";

        //    var request = new HttpRequestMessage(HttpMethod.Get, url);
        //    var response = await _client.SendAsync(request);
        //    response.EnsureSuccessStatusCode();
        //    var content = await response.Content.ReadAsStringAsync();
        //    return content;
        //}



    }
}
