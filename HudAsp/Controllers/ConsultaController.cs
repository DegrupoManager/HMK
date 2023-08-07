using HudAsp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Diagnostics;

namespace HudAsp.Controllers
{
	public class ConsultaController : Controller
	{
        private readonly HttpClient _client;
        private readonly string _apiBaseUrl;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ConsultaController(IHttpClientFactory httpClientFactory, IOptions<ApiSettings> apiSettings, IHttpContextAccessor httpContextAccessor)
        {
            _client = httpClientFactory.CreateClient();
            _apiBaseUrl = apiSettings.Value.BaseUrl;
            _httpContextAccessor = httpContextAccessor;
        }

        public IActionResult Consulta()
		{
			if (Request.Cookies.TryGetValue("Rol", out var rol) && (rol == "Revisor" || rol == "Editor" || rol == "Administrador"))
			{

				return View();
			}
			else
			{

				return RedirectToAction("Login", "Login");
			}
		}

        //GET Consulta
        [HttpGet]
        [Route("api/PreOrders/getConsulta")]
        public async Task<IActionResult> GetConsultaAsync(ConsultaParameters parameters)
        {
            if (Request.Cookies.TryGetValue("Rol", out var rol) && (rol == "Revisor" || rol == "Editor" || rol == "Administrador"))
            {
                var actionCode = "005";
                var isAllowed = await GetRoleCodeComparisonAsync(actionCode);

                if (isAllowed)
                {
                    var url = $"{_apiBaseUrl}/PreOrders/getConsulta?" +
                              $"ItemCodeD={parameters.ItemCodeD}&" +
                              $"CardName={parameters.CardName}&" +
                              $"StatusDraft={parameters.StatusDraft}&" +
                              $"OrdenCompra={parameters.OrdenCompra}&" +
                              $"OrdenCompraD={parameters.OrdenCompraD}&" +
                              $"HoraFinC={parameters.HoraFinC}&" +
                              $"Coment={parameters.Coment}&" +
                              $"SlpNameV={parameters.SlpNameV}&" +
                              $"HoraInicioC={parameters.HoraInicioC}&" +
                              $"FechaInicioEmision={parameters.FechaInicioEmision}&" +
                              $"FechaFinEmision={parameters.FechaFinEmision}&" +
                              $"EstadoDraft={parameters.EstadoDraft}&" +
                              $"Direccion={parameters.Direccion}&" +
                              $"CodCliente={parameters.CodCliente}&" +
                              $"ItemNameD={parameters.ItemNameD}&" +
                              $"NombVendedor={parameters.NombVendedor}&" +
                              $"CodAlmacen={parameters.CodAlmacen}";

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

        /*[HttpGet]
        [Route("api/PreOrders/getConsulta")]
        public async Task<string> GetConsultaAsync(ConsultaParameters parameters)
        {
            var url = $"{_apiBaseUrl}/PreOrders/getConsulta?" +
                      $"ItemCodeD={parameters.ItemCodeD}&" +
                      $"CardName={parameters.CardName}&" +
                      $"StatusDraft={parameters.StatusDraft}&" +
                      $"OrdenCompra={parameters.OrdenCompra}&" +
                      $"OrdenCompraD={parameters.OrdenCompraD}&" +
                      $"HoraFinC={parameters.HoraFinC}&" +
                      $"Coment={parameters.Coment}&" +
                      $"SlpNameV={parameters.SlpNameV}&" +
                      $"HoraInicioC={parameters.HoraInicioC}&" +
                      $"FechaInicioEmision={parameters.FechaInicioEmision}&" +
                      $"FechaFinEmision={parameters.FechaFinEmision}&" +
                      $"EstadoDraft={parameters.EstadoDraft}&" +
                      $"Direccion={parameters.Direccion}&" +
                      $"CodCliente={parameters.CodCliente}&" +
                      $"ItemNameD={parameters.ItemNameD}&" +
                      $"NombVendedor={parameters.NombVendedor}&" +
                      $"CodAlmacen={parameters.CodAlmacen}";

            var request = new HttpRequestMessage(HttpMethod.Get, url);
            var response = await _client.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            return content;
        }*/

        //GET Status
        [HttpGet]
        [Route("api/PreOrders/getStatus")]
        public async Task<string> GetEstadoAsync()
        {
            var url = $"{_apiBaseUrl}/PreOrders/getEstado";
            var request = new HttpRequestMessage(HttpMethod.Get, url);
            var response = await _client.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            return content;
        }

        //GET Estados
        [HttpGet]
        [Route("api/PreOrders/getEstados")]
        public async Task<string> GetStatusAsync()
        {
            var url = $"{_apiBaseUrl}/PreOrders/getStatus";
            var request = new HttpRequestMessage(HttpMethod.Get, url);
            var response = await _client.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            return content;
        }


        [HttpGet]
        [Route("api/PreOrders/getVendedores")]
        public async Task<string> GetVendedoresAsync()
        {
            var url = $"{_apiBaseUrl}/PreOrders/getSellerList";
            var request = new HttpRequestMessage(HttpMethod.Get, url);
            var response = await _client.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            return content;
        }

        [HttpGet]
        [Route("api/PreOrders/getAlmacenes")]
        public async Task<string> GetAlmacenesAsync()
        {
            var url = $"{_apiBaseUrl}/PreOrders/getStorageList";
            var request = new HttpRequestMessage(HttpMethod.Get, url);
            var response = await _client.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            return content;
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

    }
}
