using HudAsp.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace HudAsp.Controllers
{
	public class ConsultaController : Controller
	{

		public IActionResult QueryPreliminarySalesOrder()
		{
			if (Request.Cookies.TryGetValue("Rol", out var rol) && rol == "revisor")
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
