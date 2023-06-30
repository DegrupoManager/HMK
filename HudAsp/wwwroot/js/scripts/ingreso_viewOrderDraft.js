
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
		// Aquí puedes agregar la lógica que deseas ejecutar al hacer clic en el botón "Aceptar"
		$('#myModal').modal('hide');
	});
};

var handleRenderDatepicker = function () {

	//const date = new Date();
	//const options = {
	//	day: '2-digit',
	//	month: '2-digit',
	//	year: 'numeric'
	//	//hour: '2-digit',
	//	//minute: '2-digit',
	//	//second: '2-digit'
	//}
	//var fecha = new Intl.DateTimeFormat('es-Es', options).format(date);

	////console.log(fecha);

	//$('#datepicker-default').val(fecha);
	//$('#datepicker-range').val(fecha);
	//$('#datepicker-inline').val(fecha);

	$('#datepicker-default').datepicker({
		autoclose: true,
		format: 'dd/mm/yyyy'
	}).datepicker("setDate", new Date());

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

	//var get_cliente_cod = {
	//	"url": "https://LAPTOP-4OBRKJSA:50000/b1s/v1/view.svc/DGP_GET_CLIENTE_COD_B1SLQuery",
	//	"method": "GET",
	//	"timeout": 0,
	//	"xhrFields": {
	//		"withCredentials": "true"
	//	}
	//}

	//var clientePorCodigo = [];
	//var clientePorNombre = [];

	//$.ajax(get_cliente_cod).done(function (response) {
	//	console.log(response);

	//	clientePorCodigo = response.value;

	//	console.log(clientes);
	//});

	//$('#inputCodigo').change(function () {
	//	var letra = $(this).val();

	//	var wanted = clientePorCodigo.filter(function (item) { return (item.CardCode == letra); });

	//	console.log(wanted);

	//	$('#inputCliente').val(wanted[0].CardName);
	//	$('#inputContacto').val(wanted[0].ContactPerson);

	//});

	$.typeahead({
		input: '#inputCodigoCliente',
		order: "desc",
		source: {
			data: [
				"A0001", "A0002", "A0003", "ART001", "ART002", "ART003", "P001", "P002", "P003"
			]
		},
		minLength: 3
	});

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
		<'row mb-3 px-3 pt-2'
			<'col-4 p-0'
				l
			>
			<'col-8 p-0'
				f
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
		lengthMenu: [10, 20, 30, 40, 50],
		language: {
			search: "_INPUT_",
			searchPlaceholder: "🔍 Búsqueda",
			url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
		},
		dom: domHTML,
		ordering: false,
		buttons: [],
		scrollX: true,
		initComplete: function () {
			$('#datatableNewOrderDraft_filter').append(btnHTML);
			$('#datatableNewOrderDraft_filter input[type="search"]').removeClass('form-control-sm');

			var botonAgregar = $('#agregarFilaProducto').on('click', function () {

				counter++;

				var input01 = `
					<div class="input-group px-2">
                        <span class="input-group-text"><i class="fa-solid fa-magnifying-glass"></i></span>
                        <input class="form-control bg-inverse bg-opacity-10" placeholder="A00001" name="inputCodigoArticulo${counter}" id="inputCodigoArticulo${counter}" disabled>
                    </div>
				`;

				var input02 = `
					<div class="input-group px-2">
                        <span class="input-group-text"><i class="fa-solid fa-magnifying-glass"></i></span>
                        <input class="form-control bg-inverse bg-opacity-10" placeholder="IBM Infoprint 1312" id="inputDescripcionArticulo${counter}" disabled>
                    </div>
				`;

				var input03 = `
					<div class="input-group px-3">
                        <span class="input-group-text"><i class="fa-solid fa-magnifying-glass"></i></span>
                        <input class="form-control bg-inverse bg-opacity-10" placeholder="01" name="inputCodigoAlmacen${counter}" id="inputCodigoAlmacen${counter}" disabled>
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
                        <input class="form-control bg-inverse bg-opacity-10" name="inputCantidad${counter}" id="inputCantidad${counter}" style="text-align: center;" disabled>
                    </div>
				`;

				var input08 = `
					<div class="input-group">
                        <input class="form-control bg-inverse bg-opacity-10" placeholder="200" name="inputPrecio${counter}" id="inputPrecio${counter}" style="text-align: center;" disabled>
                    </div>
				`;

				var input09 = `
					<div class="input-group px-5">
                        <input class="form-control bg-inverse bg-opacity-10" name="inputPorcentajeDescuento${counter}" placeholder="0" id="inputPorcentajeDescuento${counter}" style="text-align: center;" disabled>
                    </div>
				`;

				var input10 = `
					<div class="input-group">
                        <input class="form-control bg-inverse bg-opacity-10" placeholder="18" id="inputIGV${counter}" style="text-align: center;" disabled>
                    </div>
				`;

				const fila = [input01, input02, input03, input04, input05, input06, input07, input08, input09, input10];

				var newRow = table.row.add(fila).draw(false).node();
				$(newRow).find('.eliminarFila').attr('data-row-index', counter);

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

	$("#alertaConfirmacion").hide();

	$('#formNewOrderDraft').submit(function (e) {
		e.preventDefault();

		var codigo = $('#inputCodigo').val();
		var personaContacto = $('#inputPersonaContacto').val();
		var numeroReferencia = $('#inputNumeroReferencia').val();
		var direccionDestino = $('#inputDireccionDestino').val();
		var destinatarioFactura = $('#inputDestinatarioFactura').val();
		var moneda = $('#inputMoneda').val();

		var momentFecha = moment($('#datepicker-default').val(), "MM/DD/YYYY");
		var fechaFormateada = momentFecha.format("YYYY-MM-DD");
		var fechaContabilización = fechaFormateada;

		var momentFecha2 = moment($('#datepicker-range').val(), "MM/DD/YYYY");
		var fechaFormateada2 = momentFecha2.format("YYYY-MM-DD");
		var fechaEntrega = fechaFormateada2;

		var momentFecha3 = moment($('#datepicker-inline').val(), "MM/DD/YYYY");
		var fechaFormateada3 = momentFecha3.format("YYYY-MM-DD");
		var fechaDocumento = fechaFormateada3;

		var condicionPago = $('#inputCondicionPago').val();
		var comentario = $('#textAreaComentario').val();

		var nuevaOrdenPreliminar = new OrdenPreliminar(codigo, personaContacto, numeroReferencia, direccionDestino, destinatarioFactura, moneda, fechaContabilización, fechaEntrega, fechaDocumento, condicionPago, comentario);

		var detalle = [];
		$('#detalleRow tr').each(function () {
			var CodigoArticulo = $(this).find('[name^="inputCodigoArticulo"]').val();
			var CodigoAlmacen = $(this).find('[name^="inputCodigoAlmacen"]').val();
			var Precio = $(this).find('[name^="inputPrecio"]').val();
			var Cantidad = $(this).find('[name^="inputCantidad"]').val();
			var PorcentajeDescuento = $(this).find('[name^="inputPorcentajeDescuento"]').val();

			nuevaOrdenPreliminar.addDocumentLine(CodigoArticulo, CodigoAlmacen, Precio, Cantidad, PorcentajeDescuento);
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