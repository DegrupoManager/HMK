
var handleRenderTableData = function () {

	/*BEGIN datatable */
	var table = $('#datatableUser').DataTable({
		language: {
			search: "_INPUT_",
			//search: '<i class="fas fa-search"></i> Buscar: <input type="search" class="ps-35px mx-0">',
			searchPlaceholder: "Búsqueda de usuarios",
			url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
		},
		searching: false,
		//LengthMenu: 10,
		pageLength: 100,
		buttons: [],
		dom: 'lBfrtip',
		//scrollY: true,
		responsive: true,
		pagination: true,
		info: true,
		lengthChange: false,
		autoWidth: false,
		ajax: {
			url: '/api/user/list',
			dataSrc: ''
		},
		columns: [
			{ data: "id" },
			{ data: "nombreUsuario" },
			{ data: "descripcionRol" },
			{ data: "accesoAppWeb" },
			{ data: null, defaultContent: "" }
		], columnDefs: [
			{
				targets: 4,
				render: function (data, type, row, meta) {
					var id = row["id"];
					var opcionesHTML = `
						<button type="button" class="btn btn-icon text-theme editarUser" style="--bs-btn-padding-x: 0.25rem;" data-id="${id}">
							<i class="fa-solid fa-pen-to-square"></i>
						</button>
					`;

					return opcionesHTML;
				}
			}
		],
		createdRow: function (row, data, index) {
			$('td', row).addClass('align-middle');
			$('td', row).addClass('px-3');

			$('td', row).addClass('text-sm');

			var column0 = $('td:eq(0)', row);
			var id = column0.text();
			var url = `/Administrador/ViewUser?userId=${id}`;

			column0.html('<a href="' + url + '">' + id + '</a>');
			column0.addClass('ps-5');

		}
	});
	/*END datatable */

	$(document).on('click', '.editarUser', function () {
		var id = $(this).data('id');

		window.location.href = `/Administrador/EditUser?userId=${id}`;
	});

};


/* Controller
------------------------------------------------ */
$(document).ready(function () {
	handleRenderTableData();

});