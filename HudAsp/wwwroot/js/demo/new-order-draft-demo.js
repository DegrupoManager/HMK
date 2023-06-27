
var handleToastToggle = function () {
	$('#showToastBtn').click(function () {
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


	$('#openModalBtn').click(function () {
		$('#myModal').modal('show');
	});

	$('#acceptBtn').click(function () {
		$('#myModal').modal('hide');
	});
};

var handleRenderDatepicker = function () {

	$('#datepicker-default').datepicker({
		autoclose: true,
		format: 'dd/mm/yyyy'
	}).datepicker("setDate", new Date());

	console.log($('#datepicker-default').val());

	$('#datepicker-component').datepicker({
		autoclose: true,
		format: 'dd/mm/yyyy'
	}).datepicker("setDate", new Date());

	$('#datepicker-range').datepicker({
		autoclose: true,
		format: 'dd/mm/yyyy'
	}).datepicker("setDate", new Date());

	$('#datepicker-inline').datepicker({
		autoclose: true,
		format: 'dd/mm/yyyy'
	}).datepicker("setDate", new Date());

};
var handleRenderTypeahead = function () {

	var get_cliente_cod = {
		"url": "https://LAPTOP-4OBRKJSA:50000/b1s/v1/view.svc/DGP_GET_CLIENTE_COD_B1SLQuery",
		"method": "GET",
		"timeout": 0,
		"xhrFields": {
			"withCredentials": "true"
		}
	}

	var clientePorCodigo = [];
	var clientePorNombre = [];

	$.ajax(get_cliente_cod).done(function (response) {
		clientePorCodigo = response.value;

		console.log(clientePorCodigo);

		var uniqueCodigoClienteData = clientePorCodigo.reduce(function (acc, current) {
			var codigoCliente = current.Codigo_Cliente;
			if (!acc.includes(codigoCliente)) {
				acc.push(codigoCliente);
			}
			return acc;
		}, []);

		console.log(uniqueCodigoClienteData);

		$.typeahead({
			input: '#inputCodigoCliente',
			order: "desc",
			source: {
				data: uniqueCodigoClienteData
			},
			minLength: 3
		});

		$('.typeahead__query .input-group-text').on('click', function () {
			var codigoCliente = $('#inputCodigoCliente').val();

			if (codigoCliente.length >= 3) {
				var direccionesDestinoFiltradas = clientePorCodigo.filter(function (item) {
					return item.Codigo_Cliente === codigoCliente;
				}).map(function (item) {
					return item.Direccion_Destino;
				});

				var direccionesFacturaFiltradas = clientePorCodigo.filter(function (item) {
					return item.Codigo_Cliente === codigoCliente;
				}).map(function (item) {
					return item.Direccion_Factura;
				});

				$('#inputDireccionDestino').empty();
				$('#inputDestinatarioFactura').empty();

				direccionesDestinoFiltradas.forEach(function (direccion) {
					var option = $('<option></option>').text(direccion);
					$('#inputDireccionDestino').append(option);
				});

				direccionesFacturaFiltradas.forEach(function (direccion) {
					var option = $('<option></option>').text(direccion);
					$('#inputDestinatarioFactura').append(option);
				});

				var campo = clientePorCodigo.filter(function (item) {
					return item.Codigo_Cliente === codigoCliente;
				});

				console.log(campo);

				if (campo.length > 0) {
					$('#inputNombreCliente').val(campo[0].Nombre_Cliente);
					$('#inputPersonaContacto').val(campo[0].Persona_contacto);
					$('#inputCondicionPago').val(campo[0].Condicion_pago);
				} else {
					$('#inputNombreCliente').val('');
					$('#inputPersonaContacto').val('');
					$('#inputCondicionPago').val('');
				}
			} else {
				// Vaciar los campos si el input está vacío
				$('#inputNombreCliente').val('');
				$('#inputPersonaContacto').val('');
				$('#inputCondicionPago').val('');
				$('#inputDireccionDestino').empty();
				$('#inputDestinatarioFactura').empty();
			}
		});

	});


	/*BEGIN get_cliente_cod*/
	//$.ajax(get_cliente_cod).done(function (response) {
	//	clientePorCodigo = response.value;

	//	console.log(clientePorCodigo);

	//	var uniqueCodigoClienteData = clientePorCodigo.reduce(function (acc, current) {
	//		var codigoCliente = current.Codigo_Cliente;
	//		if (!acc.includes(codigoCliente)) {
	//			acc.push(codigoCliente);
	//		}
	//		return acc;
	//	}, []);

	//	console.log(uniqueCodigoClienteData);

	//	$.typeahead({
	//		input: '#inputCodigoCliente',
	//		order: "desc",
	//		source: {
	//			data: uniqueCodigoClienteData
	//		},
	//		minLength: 3
	//	});
	//	$('.typeahead__query .input-group-text').on('click', function () {
	//		var codigoCliente = $('#inputCodigoCliente').val();

	//		if (codigoCliente.length >= 3) {

	//			/* BEGIN Direccion Destino */
	//			var direccionesDestinoFiltradas = clientePorCodigo.filter(function (item) {
	//				return item.Codigo_Cliente === codigoCliente;
	//			}).map(function (item) {
	//				return item.Direccion_Destino;
	//			});

	//			var direccionesFacturaFiltradas = clientePorCodigo.filter(function (item) {
	//				return item.Codigo_Cliente === codigoCliente;
	//			}).map(function (item) {
	//				return item.Direccion_Factura;
	//			});

	//			$('#inputDireccionDestino').empty();
	//			$('#inputDestinatarioFactura').empty();

	//			direccionesDestinoFiltradas.forEach(function (direccion) {
	//				var option = $('<option></option>').text(direccion);
	//				$('#inputDireccionDestino').append(option);
	//			});

	//			direccionesFacturaFiltradas.forEach(function (direccion) {
	//				var option = $('<option></option>').text(direccion);
	//				$('#inputDestinatarioFactura').append(option);
	//			});

	//			/* END Direccion Destino */


	//			/* END Direccion Factura */

	//			/* BEGIN Campos Unitarios */
	//			var campo = clientePorCodigo.filter(function (item) {
	//				return item.Codigo_Cliente === codigoCliente;
	//			});

	//			console.log(campo);

	//			if (campo.length > 0) {
	//				$('#inputNombreCliente').val(campo[0].Nombre_Cliente);
	//				$('#inputPersonaContacto').val(campo[0].Persona_contacto);
	//				$('#inputCondicionPago').val(campo[0].Condicion_pago);
	//			} else {
	//				$('#inputNombreCliente').val('');
	//				$('#inputPersonaContacto').val('');
	//				$('#inputCondicionPago').val('');
	//			}

	//			/* END Campos Unitarios */

	//		}
	//	});

	//});

	/*END get_cliente_cod*/



	$.typeahead({
		input: '#inputNombreCliente',
		order: "desc",
		source: {
			data: [
				"A0001", "A0002", "A0003", "ART001", "ART002", "ART003", "P001", "P002", "P003"
			]
		},
		minLength: 3
	});

	$.typeahead({
		input: '#inputPersonaContacto',
		order: "desc",
		source: {
			data: [
				"A0001", "A0002", "A0003", "ART001", "ART002", "ART003", "P001", "P002", "P003"
			]
		},
		minLength: 3
	});

};

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
				f
			>
			<'#pBoton.col-3 ms-auto p-0'
				
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

	var lupaHTML = `
		<div class="input-group-text position-absolute top-0 bottom-0 bg-none border-0 start-0">
			<i class="fa fa-search opacity-5"></i>
		</div>
	`;

	var buscarHTML = `
		<div class="input-group mb-3">
		  <input type="text" class="form-control" id="customSearchInput" placeholder="Buscar...">
		</div>
	`;

	class DocumentLine {
		constructor(ItemCode, WarehouseCode, UnitPrice, Quantity, DiscountPercent) {
			this.ItemCode = ItemCode;
			this.WarehouseCode = WarehouseCode;
			this.UnitPrice = UnitPrice;
			this.Quantity = Quantity;
			this.DiscountPercent = DiscountPercent;
		}
	}

	class OrdenPreliminar {
		constructor(CardCode, ContactPersonCode, NumAtCard, ShipToCode, PayToCode, DocCurrency, DocDate, DocDueDate, TaxDate, GroupNum, Comments) {
			this.CardCode = CardCode;
			this.ContactPersonCode = ContactPersonCode;
			this.NumAtCard = NumAtCard;
			this.ShipToCode = ShipToCode;
			this.PayToCode = PayToCode;
			this.DocCurrency = DocCurrency;
			this.DocObjectCode = 17;
			this.DocDate = DocDate;
			this.DocDueDate = DocDueDate;
			this.TaxDate = TaxDate;
			this.GroupNum = GroupNum;
			this.Comments = Comments;
			this.DocumentLines = [];
		}

		addDocumentLine(ItemCode, WarehouseCode, UnitPrice, Quantity, DiscountPercent) {
			const documentLine = new DocumentLine(ItemCode, WarehouseCode, UnitPrice, Quantity, DiscountPercent);
			this.DocumentLines.push(documentLine);
		}
	}

	var counter = 0;
	var filaEliminada = [];

	var table = $('#datatableNewOrderDraft').DataTable({
		lengthMenu: [5, 10, 15, 20],
		language: {
			search: "_INPUT_",
			searchPlaceholder: "Búsqueda",
			url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
		},
		dom: domHTML,
		ordering: false,
		buttons: [],
		scrollX: true,
		initComplete: function () {

			$('#datatableNewOrderDraft_filter input[type="search"]').removeClass('form-control-sm');
			$('#datatableNewOrderDraft_filter input[type="search"]').addClass('px-35px');
			$('#datatableNewOrderDraft_filter input[type="search"]').addClass('mx-0');
			$('#datatableNewOrderDraft_filter input[type="search"]').addClass('rounded-end');

			var label = document.querySelector('#datatableNewOrderDraft_filter label');

			label.classList.add('input-group');

			label.id = 'filtroBuscador';
			$('#filtroBuscador').append(lupaHTML);
			$('#pBoton').append(btnHTML);

			var botonAgregar = $('#agregarFilaProducto').on('click', function () {

				counter++;

				var opciones = `
					<div class="px-2">
						<button type="button" class="btn btn-icon text-theme duplicarFila" style="--bs-btn-padding-x: 0.25rem;">
							<i class="fa-regular fa-copy"></i>
						</button>
						<button type="button" class="btn btn-icon text-theme eliminarFila" style="--bs-btn-padding-x: 0.25rem;" data-counter="${counter}">
							<i class="fa-regular fa-trash-can"></i>
						</button>
					</div>
				`;

				var input01 = `
					<div class="input-group px-2">
                        <span class="input-group-text"><i class="fa-solid fa-magnifying-glass"></i></span>
                        <input class="form-control searchable" placeholder="A00001" name="inputCodigoArticulo${counter}" id="inputCodigoArticulo${counter}" data-column="${counter}">
                    </div>
				`;

				var input02 = `
					<div class="input-group px-2">
                        <span class="input-group-text"><i class="fa-solid fa-magnifying-glass"></i></span>
                        <input class="form-control" placeholder="IBM Infoprint 1312" id="inputDescripcionArticulo${counter}">
                    </div>
				`;

				var input03 = `
					<div class="input-group px-3">
                        <span class="input-group-text"><i class="fa-solid fa-magnifying-glass"></i></span>
                        <input class="form-control" placeholder="01" name="inputCodigoAlmacen${counter}" id="inputCodigoAlmacen${counter}">
                    </div>
				`;

				var input04 = `
					<div class="input-group px-4">
                        <input class="form-control bg-inverse bg-opacity-10" placeholder="1000" id="inputCantidadAlmacen${counter}" style="text-align: center;" disabled>
                    </div>
				`;

				var input05 = `
					<div class="input-group px-2">
                        <input class="form-control bg-inverse bg-opacity-10" placeholder="2000" id="inputStockAlmacen${counter}" style="text-align: center;" disabled>
                    </div>
				`;

				var input06 = `
					<div class="input-group px-2">
                        <input class="form-control bg-inverse bg-opacity-10" placeholder="xxxxxxxxxxxx" id="inputCodigoBarras${counter}" style="text-align: center;" disabled>
                    </div>
				`;

				var input07 = `
					<div class="input-group px-2">
                        <input class="form-control" name="inputCantidad${counter}" id="inputCantidad${counter}" style="text-align: center;">
                    </div>
				`;

				var input08 = `
					<div class="input-group">
                        <input class="form-control bg-inverse bg-opacity-10" placeholder="200" name="inputPrecio${counter}" id="inputPrecio${counter}" style="text-align: center;" disabled>
                    </div>
				`;

				var input09 = `
					<div class="input-group px-5">
                        <input class="form-control" name="inputPorcentajeDescuento${counter}" placeholder="0" id="inputPorcentajeDescuento${counter}" style="text-align: center;">
                    </div>
				`;

				var input10 = `
					<div class="input-group">
                        <input class="form-control bg-inverse bg-opacity-10" placeholder="18" id="inputIGV${counter}" style="text-align: center;" disabled>
                    </div>
				`;

				const fila = [opciones, input01, input02, input03, input04, input05, input06, input07, input08, input09, input10];

				var newRow = table.row.add(fila).draw(false).node();
				$(newRow).find('.eliminarFila').attr('data-row-index', counter);

				$(`#inputCantidad${counter}`).val(1);
				$(`#inputPorcentajeDescuento${counter}`).val(0);

				/*BEGIN Busqueda en inputs*/

				$('#datatableNewOrderDraft_filter input[type="search"]').on('keyup change', function () {
					var searchTerm = $(this).val();
					$('.searchable').each(function () {
						var column = $(this).data('column');
						table.column(column).search(searchTerm);
					});
					table.draw();
				});

				/*END Busqueda en inputs*/

			});

			$(document).on('click', '.eliminarFila', function () {
				var rowIndex = $(this).data('row-index');
				var filaActual = $(this).closest('tr');

				filaEliminada.push(rowIndex);
				table.row(filaActual).remove().draw(false);
			});

			$(document).on('click', '.duplicarFila', function () {

				counter++;

				var filaActual = $(this).closest('tr');
				var nuevaFila = filaActual.clone();

				var nuevaID = 'fila' + counter;

				nuevaFila.attr('id', nuevaID);
				nuevaFila.find('[id^=inputCodigoArticulo]').attr('id', 'inputCodigoArticulo' + counter);
				nuevaFila.find('[id^=inputDescripcionArticulo]').attr('id', 'inputDescripcionArticulo' + counter);

				table.row.add(nuevaFila).draw(false);

			});

			botonAgregar.click();


		}
	});

	function formatearFecha(fecha, formato) {
		var partesFecha = fecha.split('/');
		var dia = partesFecha[1];
		var mes = partesFecha[0];
		var anio = partesFecha[2];

		var fechaFormateada = '';

		switch (formato) {
			case 'YYYY-MM-DD':
				fechaFormateada = anio + '-' + mes + '-' + dia;
				break;
			case 'DD-MM-YYYY':
				fechaFormateada = dia + '-' + mes + '-' + anio;
				break;
			// Agrega otros formatos según tus necesidades

			default:
				fechaFormateada = fecha; // Mantener el formato original si no se reconoce el formato especificado
				break;
		}

		return fechaFormateada;
	}


	$(document).on('click', '#formNewOrderDraft input[type="submit"]', function (e) {
		e.preventDefault();

		var codigo = $('#inputCodigoCliente').val();
		var personaContacto = $('#inputPersonaContacto').val();
		var numeroReferencia = $('#inputNumeroReferencia').val();
		var direccionDestino = $('#inputDireccionDestino').val();
		var destinatarioFactura = $('#inputDestinatarioFactura').val();
		var moneda = $('#inputMoneda').val();

		var fechaFormateada = $('#datepicker-default').val();
		var fechaContabilizacion = formatearFecha(fechaFormateada, 'YYYY-MM-DD');

		var fechaFormateada2 = $('#datepicker-range').val();
		var fechaEntrega = formatearFecha(fechaFormateada2, 'YYYY-MM-DD');

		var fechaFormateada3 = $('#datepicker-inline').val();
		var fechaDocumento = formatearFecha(fechaFormateada3, 'YYYY-MM-DD');

		var condicionPago = $('#inputCondicionPago').val();
		var comentario = $('#textAreaComentario').val(); 

		var nuevaOrdenPreliminar = new OrdenPreliminar(codigo,personaContacto,numeroReferencia,direccionDestino,destinatarioFactura,moneda,fechaContabilizacion,fechaEntrega,fechaDocumento,condicionPago,comentario);

		$('#detalleRow tr').each(function () {
			var CodigoArticulo = $(this).find('[name^="inputCodigoArticulo"]').val();
			var CodigoAlmacen = $(this).find('[name^="inputCodigoAlmacen"]').val();
			var Precio = $(this).find('[name^="inputPrecio"]').val();
			var Cantidad = $(this).find('[name^="inputCantidad"]').val();
			var PorcentajeDescuento = $(this).find('[name^="inputPorcentajeDescuento"]').val();

			nuevaOrdenPreliminar.addDocumentLine(CodigoArticulo,CodigoAlmacen,Precio,Cantidad,PorcentajeDescuento);
		});
		console.log(nuevaOrdenPreliminar);

		var dataDraft = JSON.stringify(nuevaOrdenPreliminar);

		console.log(dataDraft);

		var postDraft = {
			"url": "https://LAPTOP-4OBRKJSA:50000/b1s/v1/Drafts",
			"method": "POST",
			"timeout": 0,
			"xhrFields": {
				"withCredentials": "true"
			},
			"headers": {
				"Content-Type": "application/json"
			},
			"data": dataDraft,
		};

		$.ajax(postDraft).done(function (response, textStatus, jqXHR) {
			var respuestaError = response.error;

			$("#alertaConfirmacion").show();
			$("#alertaConfirmacion").removeClass("alert-danger").addClass("alert-success");
			$("#alertaConfirmacion").text("La orden de venta preliminar fue creada correctamente.").fadeIn();;
			ocultarMensaje();

		}).fail(function (jqXHR, textStatus, errorThrown) {
			console.log(jqXHR.status);

			$("#alertaConfirmacion").show();
			$("#alertaConfirmacion").removeClass("alert-success").addClass("alert-danger");
			$("#alertaConfirmacion").text("Se produjo un error en la solicitud.").fadeIn();
			ocultarMensaje();
		});

		function ocultarMensaje() {
			setTimeout(function () {
				$("#alertaConfirmacion").fadeOut();
			}, 5000);
		};

	});

};


/* Controller
------------------------------------------------ */
$(document).ready(function () {
	handleRenderTableData();
	handleRenderTypeahead();
	handleToastToggle();
	handleRenderDatepicker();
});