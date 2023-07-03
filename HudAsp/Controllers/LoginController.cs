using HudAsp.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Net.Http;
using System.Text;

namespace HudAsp.Controllers;

public class LoginController : Controller
{
    public IActionResult Login()
	{

		Response.Cookies.Delete("Usuario");
		Response.Cookies.Delete("Rol");

        return View();
	}

	/*
	private async Task ImprimirRespuestaAsync()
	{
		try
		{
			var responseContent = await Conexion();
			Console.WriteLine(responseContent);
		}
		catch (Exception ex)
		{
			Console.WriteLine($"Error: {ex.Message}");
		}
	}*/

	/*
    static async Task<string> Conexion()
    {
        using (var client = new HttpClient())
        {
            var loginUrl = "https://LAPTOP-4OBRKJSA:50000/b1s/v1/Login";
            var loginData = new
            {
                CompanyDB = "SBODEMOPE_DGP",
                Password = "1234",
                UserName = "manager"
            };

            var jsonContent = JsonConvert.SerializeObject(loginData);
            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            var response = await client.PostAsync(loginUrl, content);
            response.EnsureSuccessStatusCode();

            return await response.Content.ReadAsStringAsync();
        }
    }*/


	[HttpPost]
	[Route("api/Ejemplo")]
	public IActionResult Ejemplo([FromBody] JObject datos)
	{
		var respuesta = JsonConvert.SerializeObject(datos);
		return Ok(respuesta);
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

				var loginURL = "http://169.47.224.163:5024/api/auth/login";
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
