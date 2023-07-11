using HudAsp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Diagnostics;

namespace HudAsp.Controllers
{
	public class ConsultaController : Controller
	{
        private readonly HttpClient _client;
        private readonly string _apiBaseUrl;

        public ConsultaController(IHttpClientFactory httpClientFactory, IOptions<ApiSettings> apiSettings)
        {
            _client = httpClientFactory.CreateClient();
            _apiBaseUrl = apiSettings.Value.BaseUrl;
        }

        public IActionResult QueryPreliminarySalesOrder()
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

        //GET Estados
        [HttpGet]
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
        }

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

        //GET obtener lista clientes
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

    }
}
