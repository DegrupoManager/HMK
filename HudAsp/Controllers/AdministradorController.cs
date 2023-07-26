using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

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

		public IActionResult NewUser()
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


	}
}
