using HudAsp.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace HudAsp.Controllers
{
//[Authorize]
	public class IngresoController : Controller
	{

		public IActionResult OrderDraft()
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

		public IActionResult NewOrderDraft()
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


	}
}
