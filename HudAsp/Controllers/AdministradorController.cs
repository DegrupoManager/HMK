using Microsoft.AspNetCore.Mvc;

namespace HudAsp.Controllers
{
	public class AdministradorController : Controller
	{
		public IActionResult User()
		{
			if (Request.Cookies.TryGetValue("Rol", out var rol) && rol == "administrador")
			{

				return View();
			}
			else
			{

				return RedirectToAction("Ingreso", "OrderDraft");
			}
		}

		public IActionResult NewUser()
		{
			if (Request.Cookies.TryGetValue("Rol", out var rol) && rol == "administrador")
			{

				return View();
			}
			else
			{

				return RedirectToAction("Ingreso", "OrderDraft");
			}
		}

	}
}
