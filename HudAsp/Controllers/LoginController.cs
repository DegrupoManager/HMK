using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using HudAsp.Models;
using Microsoft.AspNetCore.Authorization;
using Azure;

namespace HudAsp.Controllers;

public class LoginController : Controller
{
	public IActionResult Login()
	{
		Response.Cookies.Delete("Usuario");
		Response.Cookies.Delete("Rol");
		return View();
	}

	[HttpPost]
	public IActionResult Login(LoginViewModel model)
	{
		if (ModelState.IsValid)
		{

			//API

			//VALIDACION
			if (model.Usuario == "giancarlo" && model.Contraseña == "1234")
			{
				Response.Cookies.Append("Usuario", model.Usuario);
				Response.Cookies.Append("Rol", "revisor");

				return RedirectToAction("OrderDraft", "Ingreso");
			}
			else
			{
				ModelState.AddModelError("", "Credenciales inválidas");
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
