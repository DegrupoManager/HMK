using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text.Json;
using System.Text;
using Microsoft.Extensions.Options;

namespace HudAsp.Controllers
{
    public class IngresoController : Controller
	{

        private readonly HttpClient _client;
        private readonly string _apiBaseUrl;
        private readonly IHttpContextAccessor _httpContextAccessor;


        public IngresoController(IHttpClientFactory httpClientFactory, IOptions<ApiSettings> apiSettings, IHttpContextAccessor httpContextAccessor)
        {
            _client = httpClientFactory.CreateClient();
            _apiBaseUrl = apiSettings.Value.BaseUrl;
            _httpContextAccessor = httpContextAccessor;
        }

        public IActionResult OrderDraft()
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

        public async Task<IActionResult> NewOrderDraft(int? id)
        {
            if (Request.Cookies.TryGetValue("Rol", out var rol) && (rol == "Revisor" || rol == "Editor" || rol == "Administrador"))
            {
                var actionCode = "001";

                var isAllowed = await GetRoleCodeComparisonAsync(actionCode);

                if (isAllowed)
                {
                    if (id.HasValue)
                    {
                        var apiUrl = $"{_apiBaseUrl}/PreOrders?Id={id}";
                        var response = await _client.GetAsync(apiUrl);
                        response.EnsureSuccessStatusCode();
                        var content = await response.Content.ReadAsStringAsync();

                        var model = JsonConvert.DeserializeObject<List<DetalleOrderDraftModel>>(content);
                        var data = JsonConvert.SerializeObject(model);
                        var usuario = Request.Cookies["Usuario"];

                        if (model[0].Usuario == usuario || rol == "Administrador")
                        {
                            ViewBag.OrderData = data;
                            ViewBag.OrderId = id;

                            return View();
                        }
                        else
                        {
                            return RedirectToAction("OrderDraft", "Ingreso");
                        }
                    }

                    return View();
                }
                else
                {
                    return RedirectToAction("OrderDraft", "Ingreso");
                }
            }
            else
            {
                return RedirectToAction("Login", "Login");
            }
        }



        [HttpGet]
        public async Task<IActionResult> ViewOrderDraft(int id)
        {
            if (Request.Cookies.TryGetValue("Rol", out var rol) && (rol == "Revisor" || rol == "Editor" || rol == "Administrador"))
            {
                var actionCode = "003";

                var isAllowed = await GetRoleCodeComparisonAsync(actionCode);

                if (isAllowed)
                {
                    var apiUrl = $"{_apiBaseUrl}/PreOrders?Id={id}";
                    var response = await _client.GetAsync(apiUrl);
                    response.EnsureSuccessStatusCode();
                    var content = await response.Content.ReadAsStringAsync();

                    var model = JsonConvert.DeserializeObject<List<OrderDraftModel>>(content);
                    var data = JsonConvert.SerializeObject(model);
                    var usuario = Request.Cookies["Usuario"];

                    if (model[0].Usuario == usuario || rol == "Administrador")
                    {
                        ViewBag.OrderData = data;
                        ViewBag.OrderId = id;

                        return View();
                    }
                    else
                    {
                        return RedirectToAction("OrderDraft", "Ingreso");
                    }


                }
                else
                {
                    return RedirectToAction("OrderDraft", "Ingreso");
                }
            }
            else
            {
                return RedirectToAction("Login", "Login");
            }
        }

        [HttpGet]
        public async Task<IActionResult> EditOrderDraft(int id)
        {
            if (Request.Cookies.TryGetValue("Rol", out var rol) && (rol == "Revisor" || rol == "Editor" || rol == "Administrador"))
            {
                var actionCode = "008";

                var isAllowed = await GetRoleCodeComparisonAsync(actionCode);

                if (isAllowed)
                {
                    var apiUrl = $"{_apiBaseUrl}/PreOrders?Id={id}";
                    var response = await _client.GetAsync(apiUrl);
                    response.EnsureSuccessStatusCode();
                    var content = await response.Content.ReadAsStringAsync();

                    var model = JsonConvert.DeserializeObject<List<OrderDraftModel>>(content);
                    var data = JsonConvert.SerializeObject(model);
                    var usuario = Request.Cookies["Usuario"];

                    if (model[0].Usuario == usuario || rol == "Administrador")
                    {
                        ViewBag.OrderData = data;
                        ViewBag.OrderId = id;

                        return View();
                    }
                    else
                    {
                        return RedirectToAction("OrderDraft", "Ingreso");
                    }

                }
                else
                {
                    return RedirectToAction("OrderDraft", "Ingreso");
                }
            }
            else
            {
                return RedirectToAction("Login", "Login");
            }
        }


        //[HttpGet]
        //public async Task<IActionResult> EditOrderDraft(int id)
        //{
        //    var apiUrl = $"{_apiBaseUrl}/PreOrders?Id={id}";
        //    var response = await _client.GetAsync(apiUrl);
        //    response.EnsureSuccessStatusCode();
        //    var content = await response.Content.ReadAsStringAsync();

        //    var model = JsonConvert.DeserializeObject<List<OrderDraftModel>>(content);
        //    ViewBag.OrderData = JsonConvert.SerializeObject(model);
        //    ViewBag.OrderId = id;

        //    return View();
        //}

        [HttpGet]
        [Route("api/draft/list")]
        public async Task<string> GetDraftListAsync()
        {
            string id = Request.Cookies["Usuario"];
            string rol = Request.Cookies["Rol"];

            string url;
            if (rol == "Administrador")
            {
                url = $"{_apiBaseUrl}/preOrders/list?Id=";
            }
            else
            {
                url = $"{_apiBaseUrl}/preOrders/list?Id={id}";
            }

            var request = new HttpRequestMessage(HttpMethod.Get, url);
            var response = await _client.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            return content;
        }



        //GET transferencia gratuita
        [HttpGet]
		[Route("api/PreOrders/getTransferenciaGratuita")]
		public async Task<string> GetTrasnferenciaGratuitaAsync()
		{
			var request = new HttpRequestMessage(HttpMethod.Get, $"{_apiBaseUrl}/PreOrders/getTransferenciaGratuita");
			var response = await _client.SendAsync(request);
			response.EnsureSuccessStatusCode();
			var content = await response.Content.ReadAsStringAsync();
			return content;
		}

		//GET Consignacion
		[HttpGet]
		[Route("api/PreOrders/getConsignacion")]
		public async Task<string> GetConsignacionAsync()
		{
			var request = new HttpRequestMessage(HttpMethod.Get, $"{_apiBaseUrl}/PreOrders/getConsignacion");
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
			var url = $"{_apiBaseUrl}/customer/getCustomerById?customerId={customerCode}";

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
			var url = $"{_apiBaseUrl}/customer/getPersonContactsByCustomerId?customerId={customerId}";

			var request = new HttpRequestMessage(HttpMethod.Get, url);
			var response = await _client.SendAsync(request);
			response.EnsureSuccessStatusCode();
			var content = await response.Content.ReadAsStringAsync();
			return content;
		}

		//POST crear orden preliminar
		[HttpPost]
		public async Task<JsonResult> CreatePreOrder(PreOrderModel DRAFT)
		{
			var preOrderData = JsonConvert.SerializeObject(DRAFT);

			var request = new HttpRequestMessage(HttpMethod.Post, $"{_apiBaseUrl}/PreOrders");
			request.Content = new StringContent(JsonConvert.SerializeObject(DRAFT), Encoding.UTF8, "application/json");
			var response = await _client.SendAsync(request);
			response.EnsureSuccessStatusCode();
			var content = await response.Content.ReadAsStringAsync();

			return new JsonResult(Ok(content));
		}

        
        [HttpPatch]
        public async Task<JsonResult> UpdatePreOrder(UpdateOrderDraftModel DRAFT)
        {
            int visOrderCounter = 1;

            int maxLineNum = DRAFT.DocumentLines
                .Where(l => !string.IsNullOrEmpty(l.LineNum))
                .Select(l => int.TryParse(l.LineNum, out int num) ? num : 0)
                .DefaultIfEmpty(0)
                .Max();

            foreach (var line in DRAFT.DocumentLines)
            {
                if (string.IsNullOrEmpty(line.LineNum))
                {
                    line.LineNum = (maxLineNum + 1).ToString();
                    maxLineNum++;
                }

                line.VisualOrder = visOrderCounter.ToString();
                visOrderCounter++;
            }

            var preOrderData = JsonConvert.SerializeObject(DRAFT, new JsonSerializerSettings
			{
				NullValueHandling = NullValueHandling.Ignore
			});

			var request = new HttpRequestMessage(new HttpMethod("PATCH"), $"{_apiBaseUrl}/PreOrders");
            request.Content = new StringContent(preOrderData, Encoding.UTF8, "application/json");
            var response = await _client.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();

            return new JsonResult(Ok(content));
        }


        //GET obtener producto
        [HttpGet]
		[Route("api/product/getProductById")]
		public async Task<string> GetProductByIdAsync(string productCode, string productListId)
		{
			var url = $"{_apiBaseUrl}/product/getProductById?productId={productCode}&productListId={productListId}";

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
			var request = new HttpRequestMessage(HttpMethod.Get, $"{_apiBaseUrl}/product/getProductList");
			var response = await _client.SendAsync(request);
			response.EnsureSuccessStatusCode();
			var content = await response.Content.ReadAsStringAsync();
			return content;
		}

		//GET almacenes por codigo de producto
		[HttpGet]
		[Route("api/product/getStoragesByProduct")]
		public async Task<string> GetStoragesByProductAsync(string productCode)
		{
			var url = $"{_apiBaseUrl}/product/getStoragesByProductId?productId={productCode}";

			var request = new HttpRequestMessage(HttpMethod.Get, url);
			var response = await _client.SendAsync(request);
			response.EnsureSuccessStatusCode();
			var content = await response.Content.ReadAsStringAsync();
			return content;
		}

		//GET porcentaje de descuento por producto y almacen
        [HttpGet]
        [Route("api/PreOrders/getPorcentajeDescuento")]
        public async Task<string> GetPorcentajeDescuentoAsync(string productId, string storageId)
        {
            var url = $"{_apiBaseUrl}/PreOrders/getPorcentajeDescuento?productId={productId}&storageId={storageId}";

            var request = new HttpRequestMessage(HttpMethod.Get, url);
            var response = await _client.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            return content;
        }

        //GET linea articulo
        [HttpGet]
        [Route("api/PreOrders/getLineArt")]
        public async Task<string> GetAsync(string codListaPrecio, string productCode, string storageCode)
        {
            var url = $"{_apiBaseUrl}/PreOrders/getLineArt?codListaPrecio={codListaPrecio}&productId={productCode}&storageId={storageCode}";

            var request = new HttpRequestMessage(HttpMethod.Get, url);
            var response = await _client.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            return content;
        }

        //GET codigo de serie
        [HttpGet]
		[Route("api/draft/getSerieDoc")]
		public async Task<string> GetSerieDocAsync(string serieCode)
		{
			var url = $"{_apiBaseUrl}/preOrders/getSerieDoc?SerieCodigo={serieCode}";

			var request = new HttpRequestMessage(HttpMethod.Get, url);
			var response = await _client.SendAsync(request);
			response.EnsureSuccessStatusCode();
			var content = await response.Content.ReadAsStringAsync();
			return content;
		}

		//GET lista series
		[HttpGet]
		[Route("api/draft/getSerieList")]
		public async Task<string> GetSerieListAsync()
		{
			var request = new HttpRequestMessage(HttpMethod.Get, $"{_apiBaseUrl}/preOrders/getSerieList");
			var response = await _client.SendAsync(request);
			response.EnsureSuccessStatusCode();
			var content = await response.Content.ReadAsStringAsync();
			return content;
		}

        //DELETE orden preliminar
        [HttpDelete]
        [Route("api/preorders/deletePreOrderById")]
        public async Task<string> DeletePreOrderByIAsync(string id)
        {
            var url = $"{_apiBaseUrl}/PreOrders?Id={id}";

            var request = new HttpRequestMessage(HttpMethod.Delete, url);
            var response = await _client.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            return content;
        }

        //GET dirección del cliente por tipo
        [HttpGet]
        [Route("api/Customer/getCustomerAddressByType")]
        public async Task<string> GetCustomerAddressByTypeAsync(string addressType, string customerId)
        {
            var url = $"{_apiBaseUrl}/Customer/getCustomerAddressByType?addressType={addressType}&customerId={customerId}";

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
                        if(accion.Codigo == actionCode)
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
