var handleRenderTableData = function () {

	function filterColumn(i) {
		$('#datatableOrderDraft')
			.DataTable()
			.column(i)
			.search(
				$('#col' + i + '_filter').val(),
			)
			.draw();
	}

	var table = $('#datatableReporte').DataTable({
		language: {
			url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
		},
		searching: false,
		buttons: [],
		scrollX: true,
		pagination: true,
		info: true,
		lengthChange: false,
		//columns: [
		//	{ data: "Nro Orden" },
		//	{ data: "Código de Cliente" },
		//	{ data: "Nombre de Cliente" },
		//	{ data: "Fecha" },
		//	{ data: "Monto" },
		//	{ data: "Estado" },
		//	{ data: "Status" },
		//	{ data: "Usuario" },
		//	{ data: "Vendedor" },
		//	{ data: null, defaultContent: btnHTML }
		//],
		createdRow: function (row, data, index) {
			$('td', row).addClass('align-middle');
			$('td', row).addClass('px-2');
			//$('td:eq(2)', row).addClass('text-wrap');
			//$('td:eq(8)', row).addClass('text-wrap');
			$('td', row).addClass('text-sm');
		},
		initComplete: function () {

		}
	});

};

/* Controller
------------------------------------------------ */
$(document).ready(function () {
	handleRenderTableData();
});