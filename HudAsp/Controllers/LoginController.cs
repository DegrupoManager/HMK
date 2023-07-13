using HudAsp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Net.Http;
using System.Text;
using Microsoft.Extensions.Options;

namespace HudAsp.Controllers;

public class LoginController : Controller
{
    private readonly string _apiBaseUrl;

    public LoginController(IOptions<ApiSettings> apiSettings)
    {
        _apiBaseUrl = apiSettings.Value.BaseUrl;
    }
    public IActionResult Login()
	{

		Response.Cookies.Delete("Usuario");
		Response.Cookies.Delete("Rol");

        return View();
	}


	public class DatosEjemplo
	{
		public string Nombre { get; set; }
		public int Edad { get; set; }
	}


	[HttpPost]
	public IActionResult Login(LoginViewModel model)
	{
		if (ModelState.IsValid)
		{
			var requestBody = new
			{
				username = model.Usuario,
				password = model.Contraseña
			};

			using (var httpClient = new HttpClient())
			{
				var jsonBody = JsonConvert.SerializeObject(requestBody);
				var content = new StringContent(jsonBody, Encoding.UTF8, "application/json");

				var loginURL = $"{_apiBaseUrl}/auth/login";
				var response = httpClient.PostAsync(loginURL, content).GetAwaiter().GetResult();


				if (response.IsSuccessStatusCode)
				{
					var responseContent = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
					var loginResponse = JsonConvert.DeserializeObject<LoginResponse>(responseContent);
					
                    if (loginResponse != null && loginResponse.Rol != null && loginResponse.Nombre != null)
                    {
                        Response.Cookies.Append("Usuario", model.Usuario);
                        Response.Cookies.Append("Rol", loginResponse.Rol);

                        return RedirectToAction("OrderDraft", "Ingreso");
                    }
                    else
                    {
                        ModelState.AddModelError("", "Credenciales incorrectas");
                    }

                }
                else
				{
					ModelState.AddModelError("", "Error de servidor");
				}
			}
		}

		return View(model);
	}
	

	public IActionResult Logout()
	{
		Response.Cookies.Delete("Usuario");
		Response.Cookies.Delete("Rol");

		return RedirectToAction("Login", "Login");
	}


}
