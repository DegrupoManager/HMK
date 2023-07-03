using HudAsp.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json.Linq;
using Azure;
using static HudAsp.Controllers.LoginController;

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

		//GET lista de ordenes
		[HttpGet]
		[Route("api/draft/list")]
		public async Task<string> GetDraftListAsync()
		{
			var request = new HttpRequestMessage(HttpMethod.Get, "http://169.47.224.163:5024/api/preOrders/list");
			var response = await _client.SendAsync(request);
			response.EnsureSuccessStatusCode();
			var content = await response.Content.ReadAsStringAsync();
			return content;
		}

		//GET obtener cliente por su codigo
		[HttpGet]
		[Route("api/customer/getCustomerById")]
		public async Task<string> GetCustomerByIdAsync(string customerCode)
		{
			var url = $"http://169.47.224.163:5024/api/customer/getCustomerById?customerId={customerCode}";

			var request = new HttpRequestMessage(HttpMethod.Get, url);
			var response = await _client.SendAsync(request);
			response.EnsureSuccessStatusCode();
			var content = await response.Content.ReadAsStringAsync();
			return content;
		}

        //GET obtener cliente por su codigo
        [HttpGet]
        [Route("api/customer/getPersonContactsByCustomerId")]
        public async Task<string> GetPersonContactsByCustomerIdAsync(string customerId)
        {
            var url = $"http://169.47.224.163:5024/api/customer/getPersonContactsByCustomerId?customerId={customerId}";

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
            var request = new HttpRequestMessage(HttpMethod.Get, "http://169.47.224.163:5024/api/customer/getCustomerList");
            var response = await _client.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            return content;
        }

		//POST crear orden
		/*[HttpPost]
        [Route("api/PreOrders")]
        public async Task<IActionResult> CreatePreOrderAsync([FromBody] JObject dataDraft)
        {
            string jsonString = dataDraft.ToString();

            var request = new HttpRequestMessage(HttpMethod.Post, "http://169.47.224.163:5024/api/PreOrders");
            request.Content = new StringContent(jsonString, Encoding.UTF8, "application/json");

            var response = await _client.SendAsync(request);
            response.EnsureSuccessStatusCode();

            //var content = await response.Content.ReadAsStringAsync();

            return Ok();
        }*/

		[HttpPost]
		[Route("api/PreOrders")]
		public IActionResult CreatePreOrder([FromBody] PreOrderModel data)
		{
			var preOrderData = JsonConvert.SerializeObject(data);

			/*
			var request = new HttpRequestMessage(HttpMethod.Post, "http://169.47.224.163:5024/api/PreOrders");
			request.Content = new StringContent(preOrderData, Encoding.UTF8, "application/json");

			var response = await _client.SendAsync(request);
			response.EnsureSuccessStatusCode();

			var content = await response.Content.ReadAsStringAsync();*/
			return Ok(preOrderData);
		}

		[HttpPost]
		[Route("api/Ejemplo")]
		public IActionResult Ejemplo([FromBody] DatosEjemplo datos)
		{
			return Ok(JsonConvert.SerializeObject(datos));
		}


		//POST crear orden
		[HttpPost]
		[Route("api/PreOrders2")]
		public async Task<IActionResult> CreatePreOrderAsync2([FromBody] PreOrderModel data)
		{
            var preOrderData = JsonConvert.SerializeObject(data);

            /*
			string cardCode = preOrderData.CardCode;
            int contactPersonCode = preOrderData.ContactPersonCode;
            string numAtCard = preOrderData.NumAtCard;
            string shipToCode = preOrderData.ShipToCode;
            string payToCode = preOrderData.PayToCode;
            string docCurrency = preOrderData.DocCurrency;
            string docObjectCode = preOrderData.DocObjectCode;
            string docDate = preOrderData.DocDate;
            string docDueDate = preOrderData.DocDueDate;
            string taxDate = preOrderData.TaxDate;
            string groupNum = preOrderData.GroupNum;
            string comments = preOrderData.Comments;
            string series = preOrderData.Series;
            string uHmkTrans = preOrderData.U_HMK_TRANS;
            string uDgpDropConsignment = preOrderData.U_DGP_DropConsignment;
            string uDgpNumAtCardSup = preOrderData.U_DGP_NumAtCardSup;
            string uDgpOwnerCode = preOrderData.U_DGP_OwnerCode;

            List<DocumentLineModel> documentLines = preOrderData.DocumentLines;
            foreach (var documentLine in documentLines)
            {
                string itemCode = documentLine.ItemCode;
                string warehouseCode = documentLine.WarehouseCode;
                decimal unitPrice = documentLine.UnitPrice;
                decimal quantity = documentLine.Quantity;
                decimal discountPercent = documentLine.DiscountPercent;
                string vatGroup = documentLine.VatGroup;

            }*/

            var request = new HttpRequestMessage(HttpMethod.Post, "http://169.47.224.163:5024/api/PreOrders");
            request.Content = new StringContent(preOrderData, Encoding.UTF8, "application/json");
			var response = await _client.SendAsync(request);
			response.EnsureSuccessStatusCode();
			var content = await response.Content.ReadAsStringAsync();
			return Ok(content);
		}

        [HttpGet]
		[Route("api/product/getProductById")]
		public async Task<string> GetProductByIdAsync(string productCode)
		{
			var url = $"http://169.47.224.163:5024/api/product/getProductById?productId={productCode}";

			var request = new HttpRequestMessage(HttpMethod.Get, url);
			var response = await _client.SendAsync(request);
			response.EnsureSuccessStatusCode();
			var content = await response.Content.ReadAsStringAsync();
			return content;
		}

        //GET obtener lista clientes
        [HttpGet]
        [Route("api/product/getProductList")]
        public async Task<string> GetProducListAsync()
        {
            var request = new HttpRequestMessage(HttpMethod.Get, "http://169.47.224.163:5024/api/product/getProductList");
            var response = await _client.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            return content;
        }

        [HttpGet]
        [Route("api/product/getStoragesByProduct")]
        public async Task<string> GetStoragesByProductAsync(string productCode)
        {
            var url = $"http://169.47.224.163:5024/api/product/getStoragesByProductId?productId={productCode}";

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
			var url = $"http://169.47.224.163:5024/api/preOrders/getSerieDoc?SerieCodigo={serieCode}";

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
			var request = new HttpRequestMessage(HttpMethod.Get, "http://169.47.224.163:5024/api/preOrders/getSerieList");
			var response = await _client.SendAsync(request);
			response.EnsureSuccessStatusCode();
			var content = await response.Content.ReadAsStringAsync();
			return content;
		}

	}
}
