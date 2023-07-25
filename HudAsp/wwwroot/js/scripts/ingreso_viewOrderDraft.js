
var handleRenderTableData = function () {

	var btnHTML = `
		<label>
			<button type="button" id="agregarFilaProducto" class="btn btn-outline-theme">
				<i class="fa fa-plus-circle fa-fw me-1"></i>
				<span class="text-dark">Agregar producto</span>
			</button>
		</label>
	`;

	var domHTML = `
		<'row mb-3 px-3 pt-2 gx-3'
			<'col-5 p-0'
				l
			>
			<'#pBuscar.col-4 ms-auto px-3'
				
			>
		>
		t
		<'row align-items-center'
			<'mr-auto col-md-6 mb-3 mb-md-0 mt-n2'
				i
			>
			<'mb-0 col-md-6'
				p
			>
		>
	`;

	busquedaHTML = `
		<div>
			<label class="input-group">
				<input type="text" id="busquedaCustom" class="form-control px-35px mx-0 rounded-end" placeholder="Búsqueda">
				<div class="input-group-text position-absolute top-0 bottom-0 bg-none border-0 start-0">
					<i class="fa fa-search opacity-5"></i>
				</div>
			</label>
		</div>
	`;


	function obtenerFechaSinHora(fechaHora) {
		var fechaSinHora = fechaHora.match(/^\d{1,2}\/\d{1,2}\/\d{4}/);
		if (fechaSinHora) {
			var fecha = new Date(fechaSinHora[0]);
			var dia = fecha.getDate();
			var mes = fecha.getMonth() + 1;
			var anio = fecha.getFullYear();

			// Añadir ceros iniciales si es necesario
			dia = dia < 10 ? '0' + dia : dia;
			mes = mes < 10 ? '0' + mes : mes;

			return dia + '/' + mes + '/' + anio;
		} else {
			return '';
		}
	}

	var table = $('#datatableNewOrderDraft').DataTable({
		//lengthMenu: [5, 10, 15, 20],
		pageLength: 100,
		language: {
			url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
		},
		dom: domHTML,
		ordering: false,
		buttons: [],
		scrollX: true,
		createdRow: function (row, data, dataIndex) {
		},
		initComplete: function () {

			$('#pBuscar').append(busquedaHTML);

			/*BEGIN busqueda en input */
			$.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
				var row = table.row(dataIndex);
				var searchData = row.data().join(' ').toLowerCase();
				var searchValue = $('#busquedaCustom').val().toLowerCase();
				return searchData.includes(searchValue);
			});

			$('#busquedaCustom').on('input', function () {
				table.draw();
			});
			/*END busqueda en input */

		}
	});

	var orderData = $('#orderData').data('order');
	//console.log(orderData);

	function calcularTotales() {
		var total = 0;
		var totalImpuestos = 0;

		$('#detalleRow tr').each(function () {
			var cantidad = parseFloat($(this).find('input[name^="inputCantidad"]').val());
			var precioUnitario = parseFloat($(this).find('input[name^="inputPrecio"]').val());
			var descuento = parseFloat($(this).find('input[name^="inputPorcentajeDescuento"]').val());
			var igv = parseFloat($(this).find('input[name^="inputIGV"]').attr("data-valor"));

			var precioDescuento = precioUnitario * (1 - descuento / 100);
			var subtotal = precioDescuento * cantidad;

			var subtotalConImpuesto = subtotal * (igv / 100);

			total += subtotal;
			totalImpuestos += subtotalConImpuesto;
		});

		var formattedTotal = total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
		var formattedTotalImpuestos = totalImpuestos.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
		var formattedTotalDocumento = (total + totalImpuestos).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

		$('#inputTotal').val(formattedTotal);
		$('#inputImpuestos').val(formattedTotalImpuestos);
		$('#inputTotalDocumento').val(formattedTotalDocumento);
	}


	$(document).on('input', '#detalleRow input[name^="inputCantidad"], #detalleRow input[name^="inputPrecio"], #detalleRow input[name^="inputPorcentajeDescuento"]', function () {
		calcularTotales();
	});

	llenarDatos();
	function llenarDatos() {

		$('#viewCodigoCliente').val(orderData[0].CodigoCliente);
		$('#viewNombreCliente').val(orderData[0].NombreCliente);
		$('#viewPersonaContacto').val(orderData[0].NombrePersonaContacto);
		$('#viewNumeroReferencia').val(orderData[0].NumRef);
		$('#viewDireccionDestino').val(orderData[0].CodDireEntrega);
		$('#viewtDestinatarioFactura').val(orderData[0].CodDireFactura);

		$('#viewSerieDoc').append(`
			 <option selected>${orderData[0].SeriesNombre}</option>
		`)

		$('#viewCorrelativo').val(orderData[0].DocNumero);
		$('#textAreaComentario').val(orderData[0].Comentario);

		$('#textAreaDireccionDestino').val(orderData[0].DireEntrega);
		$('#textAreaDestinatarioFactura').val(orderData[0].DireFactura);

		$('#inputNumeroOrdenCompra').val(orderData[0].OrdenDeCompra);

		/*FECHAS*/
		$('#viewFechaContabilizacion').val(obtenerFechaSinHora(orderData[0].FechaContabilizacion));
		$('#viewFechaEntrega').val(obtenerFechaSinHora(orderData[0].FechaEntrega));
		$('#viewFechaDocumento').val(obtenerFechaSinHora(orderData[0].FechaDocumento));
		/*FECHAS*/

		$('#viewMoneda').val(orderData[0].Moneda);
		$('#viewCondicionPago').val(orderData[0].TerminoPago);

		$('#viewTransGrat').val(orderData[0].DescripcionTransferencia);
		$('#viewConsignacion').val(orderData[0].DescripcionConsignacion);

		$('#viewTransGrat').append(`
			 <option selected>${orderData[0].DescripcionTransferencia}</option>
		`);

		$('#viewConsignacion').append(`
			 <option selected>${orderData[0].DescripcionConsignacion}</option>
		`)

		orderData.forEach(function (item) {
			var counter = table.rows().count(); 

			var input01 = `
				<div class="input-group">
					<span data-index="${counter}" class="input-group-text porCodigoArticulo"><i class="fa-solid fa-magnifying-glass"></i></span>
					<input value="${item.CodArticulo}" type="text" class="form-control bg-inverse bg-opacity-10 custom-table-form" name="inputCodigoArticulo${counter}" id="inputCodigoArticulo${counter}" data-column="${counter}" autocomplete="off"
					style="width: 100px;" disabled>
				</div>
			  `;

			var input02 = `
				<div class="input-group">
					<span data-index="${counter}" class="input-group-text porDescripcionArticulo"><i class="fa-solid fa-magnifying-glass"></i></span>
					<input value="${item.Descripcion}" type="text" class="form-control bg-inverse bg-opacity-10 custom-table-form" name="inputDescripcionArticulo${counter}" id="inputDescripcionArticulo${counter}" data-column="${counter}"
					style="font-size: 12px; width: 750px;" disabled>
				</div>
			  `;

			var input03 = `
				<div class="input-group">
					<span data-index="${counter}" class="input-group-text porCodigoAlmacen"><i class="fa-solid fa-magnifying-glass"></i></span>
					<input value="${item.Almacen}" type="text" class="form-control bg-inverse bg-opacity-10 custom-table-form" name="inputCodigoAlmacen${counter}" id="inputCodigoAlmacen${counter}" data-column="${counter}" autocomplete="off"
					style="width: 110px;" disabled>
				</div>
			  `;

			var input04 = `
				<div class="input-group">
				  <input value="${item.CantidadAlmacen}" class="form-control bg-inverse bg-opacity-10 custom-table-form" id="inputCantidadAlmacen${counter}" disabled>
				</div>
			  `;

			var input05 = `
				<div class="input-group">
				  <input value="${item.StockGeneral}" class="form-control bg-inverse bg-opacity-10 custom-table-form" id="inputStockAlmacen${counter}" disabled>
				</div>
			  `;

			var input06 = `
				<div class="input-group">
				  <input value="${item.CodigodeBarra}" class="form-control bg-inverse bg-opacity-10 custom-table-form" id="inputCodigoBarras${counter}" disabled>
				</div>
			  `;

			var input07 = `
				<div class="input-group">
				  <input value="${item.Cantidad}" class="form-control bg-inverse bg-opacity-10 custom-table-form" name="inputCantidad${counter}" id="inputCantidad${counter}" disabled>
				</div>
			  `;

			var input08 = `
				<div class="input-group">
				  <input value="${item.PrecioUnitario}" class="form-control bg-inverse bg-opacity-10 custom-table-form" name="inputPrecio${counter}" id="inputPrecio${counter}" disabled>
				</div>
			  `;

			var input09 = `
				<div class="input-group">
				  <span class="input-group-text">%</span>
				  <input value="${item.Descuento}" class="form-control bg-inverse bg-opacity-10 custom-table-form" name="inputPorcentajeDescuento${counter}" id="inputPorcentajeDescuento${counter}" disabled>
				</div>
			  `;

			var input10 = `
				<div class="input-group">
				  <input data-valor="${item.ValorImpuesto}" value="${item.IndicadorImpuesto}" class="form-control bg-inverse bg-opacity-10 custom-table-form" name="inputIGV${counter}" id="inputIGV${counter}" disabled>
				</div>
			  `;

			var fila = [
				input01,
				input02,
				input07,
				input09,
				input03,
				input04,
				input05,
				input08,
				input10,
				input06
			];

			while (fila.length < table.columns().count()) {
				fila.push();
			}

			table.row.add(fila).draw(false);

			calcularTotales();
		});

	}

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

};


/* Controller
------------------------------------------------ */
$(document).ready(function () {
	handleRenderTableData();
});