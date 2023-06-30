using Microsoft.AspNetCore.Mvc;

namespace HudAsp.Controllers
{
	public class AdministradorController : Controller
	{
		public IActionResult User()
		{
			if (Request.Cookies.TryGetValue("Rol", out var rol) && (rol == "Revisor" || rol == "Editor"))
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
			if (Request.Cookies.TryGetValue("Rol", out var rol) && (rol == "Revisor" || rol == "Editor"))
			{

				return View();
			}
			else
			{

				return RedirectToAction("OrderDraft", "Ingreso");
			}
		}

	}
}
