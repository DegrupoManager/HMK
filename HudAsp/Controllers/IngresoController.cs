using HudAsp.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace HudAsp.Controllers
{
//[Authorize]
	public class IngresoController : Controller
	{

		private static readonly HttpClient _client = new HttpClient();

		public IActionResult OrderDraft()
        {

			if (Request.Cookies.TryGetValue("Rol", out var rol) && (rol == "Revisor" || rol == "Editor"))
			{

				return View();
			}
			else
			{

				return RedirectToAction("Login", "Login");
			}
		}

		/*private static async Task<string> GetDraftListAsync()
		{
			var request = new HttpRequestMessage(HttpMethod.Get, "http://169.47.224.163:5024/api/draft/list");
			var response = await _client.SendAsync(request);
			response.EnsureSuccessStatusCode();
			var content = await response.Content.ReadAsStringAsync();
			return content;
		}*/

		[HttpGet]
		[Route("api/draft/list")]
		public async Task<string> GetDraftListAsync()
		{
			var request = new HttpRequestMessage(HttpMethod.Get, "http://169.47.224.163:5024/api/draft/list");
			var response = await _client.SendAsync(request);
			response.EnsureSuccessStatusCode();
			var content = await response.Content.ReadAsStringAsync();
			return content;
		}

		[HttpGet]
		[Route("api/customer/getCustomerById")]
		public async Task<string> GetCustomerByIdAsync(string customerCode)
		{
			var url = $"http://169.47.224.163:5024/api/customer/getCustomerById?customerCode={customerCode}";

			var request = new HttpRequestMessage(HttpMethod.Get, url);
			var response = await _client.SendAsync(request);
			response.EnsureSuccessStatusCode();
			var content = await response.Content.ReadAsStringAsync();
			return content;
		}

		[HttpGet]
		[Route("api/product/getProductById")]
		public async Task<string> GetProductByIdAsync(string productCode)
		{
			var url = $"http://169.47.224.163:5024/api/product/getProductById?productCode={productCode}";

			var request = new HttpRequestMessage(HttpMethod.Get, url);
			var response = await _client.SendAsync(request);
			response.EnsureSuccessStatusCode();
			var content = await response.Content.ReadAsStringAsync();
			return content;
		}

		[HttpGet]
		[Route("api/draft/getSerieDoc")]
		public async Task<string> GetSerieDocAsync(string serieCode)
		{
			var url = $"http://169.47.224.163:5024/api/draft/getSerieDoc?SerieCodigo={serieCode}";

			var request = new HttpRequestMessage(HttpMethod.Get, url);
			var response = await _client.SendAsync(request);
			response.EnsureSuccessStatusCode();
			var content = await response.Content.ReadAsStringAsync();
			return content;
		}

		[HttpGet]
		[Route("api/draft/getSerieList")]
		public async Task<string> GetSerieListAsync()
		{
			var request = new HttpRequestMessage(HttpMethod.Get, "http://169.47.224.163:5024/api/draft/getSerieList");
			var response = await _client.SendAsync(request);
			response.EnsureSuccessStatusCode();
			var content = await response.Content.ReadAsStringAsync();
			return content;
		}

		public IActionResult NewOrderDraft()
		{
			if (Request.Cookies.TryGetValue("Rol", out var rol) && (rol == "Revisor" || rol == "Editor"))
			{

				return View();
			}
			else
			{

				return RedirectToAction("Login", "Login");
			}
		}

		public IActionResult ViewOrderDraft(int id)
        {
            ViewBag.OrderId = id;
            return View();
        }

		public IActionResult EditOrderDraft(int id)
        {
            ViewBag.OrderId = id;
            return View();
        }


	}
}
