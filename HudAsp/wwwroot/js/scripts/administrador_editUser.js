var handleRenderForm = function () {

	function getDatosUser() {
		return new Promise(function (resolve, reject) {
			var url = "api/user/list";

			$.ajax({
				url: url,
				type: "GET",
				success: function (response) {
					var usuarios = JSON.parse(response);
					resolve(usuario);
				},
				error: function (xhr, status, error) {
					reject(error);
				}
			});
		});
	}

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

		})
		.catch(function (error) {
			console.log(error);
		});

}


/* Controller
------------------------------------------------ */
$(document).ready(function () {
	handleRenderForm();

});