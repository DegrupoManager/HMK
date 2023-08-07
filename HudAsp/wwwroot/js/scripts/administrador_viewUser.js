var handleRenderForm = function () {

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
				console.log(data);

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
	}

	llenarDatosRoles();

	function getEstadosUser() {
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

			//llenarDatos();

		})
		.catch(function (error) {
			console.log(error);
		});

	llenarDatos();
}


/* Controller
------------------------------------------------ */
$(document).ready(function () {
	handleRenderForm();

});