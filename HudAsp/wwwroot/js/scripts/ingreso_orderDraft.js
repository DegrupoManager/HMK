
var handleRenderTableData = function () {

	/*BEGIN obtenerOrdenes */
	async function obtenerOrdenes() {
		var settings = {
			url: "https://LAPTOP-4OBRKJSA:50000/b1s/v1/view.svc/DGP_GET_PRELIMINARY_B1SLQuery",
			method: "GET",
			timeout: 0,
			xhrFields: {
				withCredentials: "true"
			}
		};

		try {
			const response = await $.ajax(settings);
			var ordenes = response.value;
			return ordenes;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
	/*END obtenerOrdenes */

	/*BEGIN html's */

	var DropdownHTML = `
		<button id="filterEstado" class="btn btn-outline-default dropdown-toggle rounded-0" type="button" data-bs-toggle="dropdown"><span class="d-none d-md-inline">Estado</span><span class="d-inline d-md-none"><i class="fa fa-check"></i></span> &nbsp;</button>
		<div class="dropdown-menu" id="estadosF">

		</div>
		<button id="filterStatus" class="btn btn-outline-default dropdown-toggle" type="button" data-bs-toggle="dropdown"><span class="d-none d-md-inline">Status</span><span class="d-inline d-md-none"><i class="fa fa-check"></i></span> &nbsp;</button>
		<div class="dropdown-menu" id="statusF">

		</div>
	`;

	var lupaHTML = `
	<div class="input-group-text position-absolute top-0 bottom-0 bg-none border-0 start-0" style="margin: 0px 0px 0px 0px;">
			<i class="fa fa-search opacity-5"></i>
	</div>
	`;

	var domHTML = `
		<'row mx-auto mb-3'
			<'col-md-12 text-left p-0'
				<'d-flex justify-content-start'
					<'flex-fill position-relative'
						
						f
						
					>
				>
			>
		>
		t
		<'row align-items-center mx-1'
			<'mr-auto col-md-6 mb-3 mb-md-0 mt-n2'
				i
			>
			<'mb-0 col-md-6'
				p
			>
		>
	`;
	/*END html's */

	/*BEGIN datatable */
	var table = $('#datatableOrderDraft').DataTable({
		language: {
			search: "_INPUT_",
			searchPlaceholder: "Búsqueda de órdenes",
			url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
		},
		buttons: [],
		dom: domHTML,
		scrollX: true,
		pagination: true,
		info: true,
		lengthChange: false,
		autoWidth: false,
		columns: [
			{ data: "Nro Orden" },
			{ data: "Código de Cliente" },
			{ data: "Nombre de Cliente" },
			{ data: "Fecha" },
			{ data: "Monto" },
			{ data: "Estado" },
			{ data: "Status" },
			{ data: "Usuario" },
			{ data: "Vendedor" },
			{ data: null, defaultContent: "" }
		], columnDefs: [
			{
				targets: 9,
				render: function (data, type, row, meta) {
					var id = row["Nro Orden"];
					var opcionesHTML = `
						<button type="button" class="btn btn-icon text-theme duplicarOrden" style="--bs-btn-padding-x: 0.25rem;" data-id="${id}">
							<i class="fa-regular fa-copy"></i>
						</button>
						<button type="button" class="btn btn-icon text-theme editarOrden" style="--bs-btn-padding-x: 0.25rem;" data-id="${id}">
							<i class="fa-solid fa-pen-to-square"></i>
						</button>
						<button type="button" class="btn btn-icon text-theme eliminarOrden" style="--bs-btn-padding-x: 0.25rem;" data-id="${id}">
							<i class="fa-regular fa-trash-can"></i>
						</button>`;

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
			var url = '/Ingreso/ViewOrderDraft?id=' + id; 

			column0.html('<a href="' + url + '">' + id + '</a>');

			var column4 = $('td:eq(4)', row);
			column4.html('S/. ' + column4.html());

			var column5 = $('td:eq(5)', row);
			column5.html('<span class="badge border border-success text-success px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center">' + column5.html() + '</span>');

			var column6 = $('td:eq(6)', row);
			column6.html('<span class="badge border border-warning text-warning px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center">' + column6.html() + '</span>');

			var column9 = $('td:eq(9)', row);
			column9.html('<div class="px-2">' + column9.html() + '</div>');

		},
		initComplete: function () {
			$('#datatableOrderDraft_filter').addClass('input-group');
			$('#datatableOrderDraft_filter input[type="search"]').removeClass('form-control-sm');
			$('#datatableOrderDraft_filter input[type="search"]').addClass('px-35px');
			$('#datatableOrderDraft_filter input[type="search"]').addClass('mx-0');

			var label = document.querySelector('#datatableOrderDraft_filter label');

			label.classList.add('input-group');

			label.id = 'filtroBuscador';
			$('#filtroBuscador').append(lupaHTML);
			$('#filtroBuscador').append(DropdownHTML);

			$('.dropdown-menu').on('click', '.dropdown-item', function (event) {
				event.preventDefault();

				var valor = $(this).text(); 

				var columna;
				if ($(this).closest('.dropdown-menu').attr('id') === 'estadosF') {
					columna = 5; 
				} else if ($(this).closest('.dropdown-menu').attr('id') === 'statusF') {
					columna = 6; 
				}

				table.column(columna).search(valor).draw();

				console.log('Búsqueda realizada en columna ' + columna + ': ' + valor);
			});

		}
	});
	/*END datatable */

	/*BEGIN Manejar metodos */
	async function manejarOrdenes() {
		try {
			var response = await obtenerOrdenes();
			obtenerFiltros(response);
			setearOrdenes();
		} catch (error) {
			console.error(error);
		}
	}

	manejarOrdenes();
	/*END Manejar metodos */

	$('#exportPDFLink').on('click', function (event) {
		event.preventDefault();
		generarPDF();
	});


	/*BEGIN duplicar */
	$(document).on('click', '.duplicarOrden', function () {

		var id = $(this).data('id');
		window.location.href = '/Ingreso/NewOrderDraft?id=' + id;
	});
	/*END duplicar */

	/*BEGIN editar */
	$(document).on('click', '.editarOrden', function () {
		var id = $(this).data('id');

		window.location.href = '/Ingreso/EditOrderDraft?id=' + id;
	});
	/*END editar */

	/*BEGIN eliminar */
	$(document).on('click', '.eliminarOrden', function () {
		var id = $(this).data('id');

		$('#myModal').modal('show');
		$('#modal-body-text').text(`Se eliminará la orden ${id} .¿Desea Seguir?`);
		$('#toast-body-text').text(`${id}`);
	});

	$(document).on('click', '#btnAceptar', function () {

		$('#myModal').modal('hide');

		var toast = $('#liveToast');
		if (toast.hasClass('hide')) {
			toast.removeClass('hide');
			toast.toast('show');
			setTimeout(function () {
				toast.toast('hide');
			}, 2000);
		} else {
			toast.toast('dispose');
			toast.addClass('hide');
			setTimeout(function () {
				toast.removeClass('hide');
				toast.toast('show');
				setTimeout(function () {
					toast.toast('hide');
				}, 2000);
			}, 100);
		}

	});
	/*END eliminar */

	/*BEGIN llenar tabla */
	function setearOrdenes() {
		obtenerOrdenes().then(function (ordenesPreliminares) {
			$.each(ordenesPreliminares, function (index, value) {
				table.row.add(value).draw();
			});
		}).catch(function (error) {
			console.error(error);
		});
	};

	/*END llenar tabla */


	/*BEGIN obtener filtros */
	function obtenerFiltros(data) {
		const estados = [];
		const status = [];

		var losEstados = [];
		var losStatus = [];

		$.each(data, function (index, value) {
			estados.push(value.Estado);
			status.push(value.Status);
		});

		const unicosEstados = estados.filter((valor, indice) => {
			return estados.indexOf(valor) === indice;
		});

		const unicosStatus = status.filter((valor, indice) => {
			return status.indexOf(valor) === indice;
		});

		losEstados.push(unicosEstados);
		losStatus.push(unicosStatus);

		losEstados.forEach(function (estado) {
			$('#estadosF').append(`<button type="button" class="dropdown-item">${estado}</button>`);
		});

		losStatus.forEach(function (status) {
			$('#statusF').append(`<button type="button" class="dropdown-item">${status}</button>`);
		});
	}
	/*END obtener filtros */

	/*BEGIN generarPDF */
	function generarPDF() {
		var tableData = table.rows({ filter: 'applied' }).data().toArray();

		var imagen = new Image();
		var dataURL;

		imagen.onload = function () {
			var elCanvas = document.createElement("canvas");
			var ctx = elCanvas.getContext("2d");
			ctx.drawImage(imagen, 0, 0);
			dataURL = elCanvas.toDataURL("image/png");
			console.log(dataURL);

			var docDefinition = {
				pageOrientation: 'landscape',
				content: [
					{ image: dataURL, width: 150 },
					{ text: 'Tabla Ordenes de venta preliminares', style: 'header' },
					{
						table: {
							body: [
								['N°', 'Código de Cliente', 'Nombre de Cliente', 'Fecha', 'Monto', 'Estado', 'Status', 'Usuario', 'Vendedor'],
								...tableData.map(function (row) {
									return [
										{ text: row['Nro Orden'], style: 'tableCell' },
										{ text: row['Código de Cliente'], style: 'tableCell' },
										{ text: row['Nombre de Cliente'], style: 'tableCell' },
										{ text: row['Fecha'], style: 'tableCell' },
										{ text: row['Monto'], style: 'tableCell' },
										{ text: row['Estado'], style: 'tableCell' },
										{ text: row['Status'], style: 'tableCell' },
										{ text: row['Usuario'], style: 'tableCell' },
										{ text: row['Vendedor'], style: 'tableCell' }
									];
								})
							]
						}
					}
				],
				styles: {
					header: { fontSize: 14, bold: true, margin: [0, 0, 0, 10] },
					tableCell: { fontSize: 12 }
				}
			};

			pdfMake.createPdf(docDefinition).open();
		};

		imagen.src = "../../img/logo/logo-Hallmark.png";
	}
	/*END generarPDF */

};


/* Controller
------------------------------------------------ */
$(document).ready(function () {
	handleRenderTableData();

});