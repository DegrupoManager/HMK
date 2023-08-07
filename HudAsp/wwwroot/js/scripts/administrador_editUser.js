var handleRenderForm = function () {

	$('#openModalBtn').click(function () {
		$('#myModal').modal('show');
	});

	$('#acceptBtn').click(function () {
		$('#myModal').modal('hide');
	});

	function getDatosUser(id) {
		return new Promise(function (resolve, reject) {
			var url = "/api/user/datos?id=" + id;

			$.ajax({
				url: url,
				type: "GET",
				success: function (response) {
					resolve(response);
				},
				error: function (xhr, status, error) {
					reject(error);
				}
			});
		});
	}

	function getAccionesRol(id) {
		return new Promise(function (resolve, reject) {
			var url = "/api/rolls/action?id=" + id;

			$.ajax({
				url: url,
				type: "GET",
				success: function (response) {
					resolve(response);
				},
				error: function (xhr, status, error) {
					reject(error);
				}
			});
		});
	}

	var userId = new URLSearchParams(window.location.search).get('userId');

	function llenarDatos() {
		getDatosUser(userId)
			.then(function (userData) {
				var data = JSON.parse(userData);

				$('#inputUsuario').val(data.Id);
				$('#inputNombre').val(data.NombreUsuario);
				$('#rolesUser').val(data.CodRol);
				$('#estadosUser').val(data.AccesoAppWeb);
				$('#inputPassword').val(data.Contrasenia);

			})
			.catch(function (error) {
				console.error("Error:", error);
			});
	}

	function llenarDatosRoles() {
		getAccionesRol('001')
			.then(function (acciones) {

				var acciones001 = JSON.parse(acciones);

				acciones001.forEach(function (accionId) {
					var id = accionId.codigo;

					$('#' + id + '-Administrador').prop("checked", true);
				});

			})
			.catch(function (error) {
				console.error("Error:", error);
			});

		getAccionesRol('002')
			.then(function (acciones) {
				var acciones002 = JSON.parse(acciones);

				acciones002.forEach(function (accionId) {
					var id = accionId.codigo;

					$('#' + id + '-Revisor').prop("checked", true);

				});


			})
			.catch(function (error) {
				console.error("Error:", error);
			});

		getAccionesRol('003')
			.then(function (acciones) {
				var acciones003 = JSON.parse(acciones);

				acciones003.forEach(function (accionId) {
					var id = accionId.codigo;

					$('#' + id + '-Editor').prop("checked", true);

				});

			})
			.catch(function (error) {
				console.error("Error:", error);
			});

		llenarDatos();
	}

	llenarDatosRoles();

	function getEstadosUser (){
		return new Promise(function (resolve, reject) {
			var url = "/api/user/estados";

			$.ajax({
				url: url,
				type: "GET",
				success: function (response) {
					var estados = JSON.parse(response);
					resolve(estados);
				},
				error: function (xhr, status, error) {
					reject(error);
				}
			});
		});
	};

	getEstadosUser()
		.then(function (estados) {

			var input = $('#estadosUser');
			input.empty();

			estados.forEach(function (estado) {
				input.append(`<option value="${estado.codigo}">${estado.descripcion}</option>`);
			});

		})
		.catch(function (error) {
			console.log(error);
		});


	function getRolesUser() {
		return new Promise(function (resolve, reject) {
			var url = "/api/rolls/list";

			$.ajax({
				url: url,
				type: "GET",
				success: function (response) {
					var roles = JSON.parse(response);
					resolve(roles);
				},
				error: function (xhr, status, error) {
					reject(error);
				}
			});
		});
	};

	getRolesUser()
		.then(function (roles) {

			var input = $('#rolesUser');
			input.empty();

			input.append('<option selected>Seleccione un rol</option>');

			roles.forEach(function (roles) {
				input.append(`<option value="${roles.codigo}">${roles.descripcion}</option>`);
			});
			llenarDatos()

		})
		.catch(function (error) {
			console.log(error);
		});

	//setTimeout(llenarDatos(), 2000);

	function rolDescripcion(cod) {
		switch (cod) {
			case '001':
				return "Crear orden preliminar";
			case '002':
				return "Eliminar";
			case '003':
				return "Visualizar";
			case '004':
				return "Duplicar orden";
			case '005':
				return "Consultar orden";
			case '006':
				return "Reporte - Guías de consignación";
			case '007':
				return "Exportar datos (PDF/XLS)";
			case '008':
				return "Editar";
			default:
				return "No definido";

		}
	}

	function obtenerIdEmpleado() {
		return new Promise(function (resolve, reject) {
			getDatosUser(userId)
				.then(function (userData) {
					var data = JSON.parse(userData);
					var Id = data.IdEmpleado;
					resolve(Id); 
				})
				.catch(function (error) {
					reject(error); 
				});
		});
	}

	var IdEmpleado;

	obtenerIdEmpleado()
		.then(function (id) {
			IdEmpleado = id;
		})
		.catch(function (error) {
			console.error(error);
		});



	$('#btnAceptar').on('click', function (e) {
		e.preventDefault();

		$('#loadingSpinner').show();
		$('#btnAceptar').prop('disabled', true);
		$('#btnCerrar').prop('disabled', true);

		var U_DGP_AppUser = $('#inputUsuario').val();
		var U_DGP_AppRolUser = $('#rolesUser').val();
		var U_DGP_AppActiveUser = $('#estadosUser').val();
		var U_DGP_AppPassword = $('#inputPassword').val();

		var patchUsuario = new UsuarioModel(U_DGP_AppActiveUser, U_DGP_AppPassword, U_DGP_AppRolUser, U_DGP_AppUser, IdEmpleado);

		var user = {
			url: "/Administrador/UpdateUser",
			type: "PATCH",
			dataType: "json",
			data: patchUsuario
		};

		var allRequests = [];

		$.ajax(user).done(function (response) {
			allRequests.push(response);
		});


		var Action001 = new RolModel('001', []);
		var line = 1;

		for (var i = 1; i <= 8; i++) {
			var Administrador = $(`#00${i}-Administrador`);
			if (Administrador.prop('checked')) {
				var valor = Administrador.val();
				var descripcion = rolDescripcion(`00${i}`);
				var action = new ActionModel(line, valor, descripcion);
				Action001.DGP_AW_USR3RACollection.push(action);
				line++;
			}
		}

		var PatchAction001 = {
			url: "/Administrador/UpdateRolActions",
			type: "PATCH",
			dataType: "json",
			data: Action001
		};

		$.ajax(PatchAction001).done(function (response) {
			allRequests.push(response);
		});


		var Action002 = new RolModel('002', []);
		var line2 = 1;

		for (var i = 1; i <= 8; i++) {
			var Revisor = $(`#00${i}-Revisor`);
			if (Revisor.prop('checked')) {
				var valor = Revisor.val();
				var descripcion = rolDescripcion(`00${i}`);
				var action = new ActionModel(line2, valor, descripcion);
				Action002.DGP_AW_USR3RACollection.push(action);
				line2++;
			}
		}

		var PatchAction002 = {
			url: "/Administrador/UpdateRolActions",
			type: "PATCH",
			dataType: "json",
			data: Action002
		};

		$.ajax(PatchAction002).done(function (response) {
			allRequests.push(response);
		});

		var Action003 = new RolModel('003', []);
		var line3 = 1;

		for (var i = 1; i <= 8; i++) {
			var Editor = $(`#00${i}-Editor`);
			if (Editor.prop('checked')) {
				var valor = Editor.val();
				var descripcion = rolDescripcion(`00${i}`);
				var action = new ActionModel(line3, valor, descripcion);
				Action003.DGP_AW_USR3RACollection.push(action);
				line3++;
			}
		}

		var PatchAction003 = {
			url: "/Administrador/UpdateRolActions",
			type: "PATCH",
			dataType: "json",
			data: Action003
		};

		$.ajax(PatchAction003).done(function (response) {
			allRequests.push(response);
		});


		$.when.apply($, allRequests).then(function () {
			setTimeout(function () {
				var allResponses = Array.from(arguments);
				var allOk = true;

				for (var i = 0; i < allResponses.length; i++) {
					if (allRequests[i][0].responseText !== 'OK' || allRequests[i][0].responseText !== '') {
						allOk = false;
						$('#modalError').modal('show');
						mostrarModal("Error", "<p>Error: " + allResponses[i][0].responseText + "</p>");
						$('#btnAceptar').prop('disabled', true);
						$('#btnCerrar').prop('disabled', true);
						break;
					}
				}

				if (allOk) {
					mostrarToastExitoso(`Se actualizó correctamente el usuario ${U_DGP_AppUser}.`);

					$('#btnAceptar').prop('disabled', false);
					$('#btnCerrar').prop('disabled', false);
				}
			}, 5000); 
		});


	});


	$("#formUser").on("submit", function (e) {
		e.preventDefault();

		$('#loadingSpinner').hide();
		$('#myModal').modal('show');
	});


	$('#btnAceptarError').on('click', function () {
		cerrarModal();
	});

	function mostrarModal(titulo, contenido) {

		$('#myModal').modal('hide');
		$('#modalTitleError').text(titulo);
		$('#modalContentError').html(contenido);
		$('#modalError').modal('show');
	}

	// Función para cerrar el modal
	function cerrarModal() {
		$('#modalError').modal('hide');
	}

	function mostrarToastExitoso(mensaje) {
		$('#myModal').modal('hide');
		var toast = $('#liveToast');
		toast.find('.toast-body').text(mensaje);
		toast.removeClass("alert-danger").addClass("alert-success");
		toast.toast('show');
		setTimeout(function () {
			toast.toast('hide');
			window.location.href = "/Administrador/User";
		}, 4000);
	}

	class UsuarioModel{
		constructor(U_DGP_AppActiveUser, U_DGP_AppPassword, U_DGP_AppRolUser, U_DGP_AppUser, Id) {
			this.U_DGP_AppActiveUser = U_DGP_AppActiveUser;
			this.U_DGP_AppPassword = U_DGP_AppPassword;
			this.U_DGP_AppRolUser = U_DGP_AppRolUser;
			this.U_DGP_AppUser = U_DGP_AppUser;
			this.Id = Id;
		}
	}

	class ActionModel {
		constructor(lineId, U_DGP_AW_ActionCode, U_DGP_AW_ActionName) {
			this.LineId = lineId;
			this.U_DGP_AW_ActionCode = U_DGP_AW_ActionCode;
			this.U_DGP_AW_ActionName = U_DGP_AW_ActionName;
		}
	}

	class RolModel{
		constructor(Code, DGP_AW_USR3RACollection) {
			this.Code = Code;
			this.DGP_AW_USR3RACollection = DGP_AW_USR3RACollection;
		}
	}

}


/* Controller
------------------------------------------------ */
$(document).ready(function () {
	handleRenderForm();

});