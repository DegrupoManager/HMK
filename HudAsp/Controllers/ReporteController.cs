using Microsoft.AspNetCore.Mvc;

namespace HudAsp.Controllers
{
	public class ReporteController : Controller
	{
		public IActionResult Reporte()
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
	}
}
