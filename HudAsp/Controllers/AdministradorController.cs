using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Text;

namespace HudAsp.Controllers
{
	public class AdministradorController : Controller
	{

		private readonly HttpClient _client;
		private readonly string _apiBaseUrl;

		public AdministradorController(IHttpClientFactory httpClientFactory, IOptions<ApiSettings> apiSettings)
		{
			_client = httpClientFactory.CreateClient();
			_apiBaseUrl = apiSettings.Value.BaseUrl;
		}

		public IActionResult User()
		{
			if (Request.Cookies.TryGetValue("Rol", out var rol) && (rol == "Revisor" || rol == "Editor" || rol == "Administrador"))
			{

				return View();
			}
			else
			{

				return RedirectToAction("OrderDraft", "Ingreso");
			}
		}

		public IActionResult EditUser(string userId)
		{
			if (Request.Cookies.TryGetValue("Rol", out var rol) && (rol == "Revisor" || rol == "Editor" || rol == "Administrador"))
			{

				ViewBag.userId = userId;

				return View();
			}
			else
			{

				return RedirectToAction("OrderDraft", "Ingreso");
			}
		}

		public IActionResult ViewUser(string userId)
		{
			if (Request.Cookies.TryGetValue("Rol", out var rol) && (rol == "Revisor" || rol == "Editor" || rol == "Administrador"))
			{

				ViewBag.userId = userId;

				return View();
			}
			else
			{

				return RedirectToAction("OrderDraft", "Ingreso");
			}
		}

		[HttpGet]
		[Route("api/user/list")]
		public async Task<string> GetUsersListAsync()
		{
			string rol = Request.Cookies["Rol"];

			string url;
			if (rol == "Administrador")
			{
				url = $"{_apiBaseUrl}/Users/list";
			}
			else
			{
				throw new UnauthorizedAccessException("No tienes permisos para acceder a esta lista.");
			}

			var request = new HttpRequestMessage(HttpMethod.Get, url);
			var response = await _client.SendAsync(request);
			response.EnsureSuccessStatusCode();
			var content = await response.Content.ReadAsStringAsync();
			return content;
		}


		[HttpGet]
		[Route("api/user/datos")]
		public async Task<string> GetDataUserAsync(string id)
		{
			string rol = Request.Cookies["Rol"];

			string url;
			if (rol == "Administrador")
			{
				url = $"{_apiBaseUrl}/Users/list";
			}
			else
			{
				throw new UnauthorizedAccessException("No tienes permisos para acceder a esta lista.");
			}

			var request = new HttpRequestMessage(HttpMethod.Get, url);
			var response = await _client.SendAsync(request);
			response.EnsureSuccessStatusCode();
			var content = await response.Content.ReadAsStringAsync();

			var usuarios = JsonConvert.DeserializeObject<List<UsuarioWeb>>(content);

			var usuarioEncontrado = usuarios.FirstOrDefault(u => u.Id == id);

			if (usuarioEncontrado != null)
			{
				var usuarioJson = JsonConvert.SerializeObject(usuarioEncontrado);
				return usuarioJson;
			}
			else
			{
				return "Usuario no encontrado.";
			}
		}


		//GET Estados de aplicación
		[HttpGet]
		[Route("api/user/estados")]
		public async Task<string> GetEstadosUsuariosAsync()
		{
			var url = $"{_apiBaseUrl}/Users/estados";

            var request = new HttpRequestMessage(HttpMethod.Get, url);
            var response = await _client.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            return content;
        }

		//GET Lista de roles
		[HttpGet]
		[Route("api/rolls/list")]
		public async Task<string> GetRolesListAsync()
		{
			var url = $"{_apiBaseUrl}/Rolls/list";


			var request = new HttpRequestMessage(HttpMethod.Get, url);
			var response = await _client.SendAsync(request);
			response.EnsureSuccessStatusCode();
			var content = await response.Content.ReadAsStringAsync();
			return content;
		}

		[HttpPatch]
		public async Task<JsonResult> UpdateUser(EditUserModel USER)
		{

			var request = new HttpRequestMessage(new HttpMethod("PATCH"), $"{_apiBaseUrl}/PreOrders");
			request.Content = new StringContent(JsonConvert.SerializeObject(USER), Encoding.UTF8, "application/json");
			var response = await _client.SendAsync(request);
			response.EnsureSuccessStatusCode();
			var content = await response.Content.ReadAsStringAsync();

			return new JsonResult(Ok(content));
		}

		/*
		 
		[HttpPatch]
        public async Task<JsonResult> UpdatePreOrder(UpdateOrderDraftModel DRAFT)
        {
            var preOrderData = JsonConvert.SerializeObject(DRAFT);

            foreach (var line in DRAFT.DocumentLines)
            {
                if (string.IsNullOrEmpty(line.LineNum))
                {
                    line.LineNum = null;
                }
            }

            var request = new HttpRequestMessage(new HttpMethod("PATCH"), $"{_apiBaseUrl}/PreOrders");
            request.Content = new StringContent(JsonConvert.SerializeObject(DRAFT), Encoding.UTF8, "application/json");
            var response = await _client.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();

            return new JsonResult(Ok(content));
        } 
		 
		*/

	}
}
