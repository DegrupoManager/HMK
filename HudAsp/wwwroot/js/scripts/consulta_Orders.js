
var handleRenderTimepicker = function () {
	$('#timepicker-inicio').timepicker();

	$('#timepicker-final').timepicker();

	$('#timepicker-default').timepicker({
		showMeridian: false,
		minuteStep: 1
	});

};

var handleRenderTableData = function () {

	function getEstados() {
		return new Promise(function (resolve, reject) {
			var url = "/api/PreOrders/getEstados";

			$.ajax({
				url: url,
				type: "GET",
				success: function (response) {
					var clientes = JSON.parse(response);
					resolve(clientes);
				},
				error: function (xhr, status, error) {
					reject(error);
				}
			});
		});
	}

	getEstados().
		then(function (estados) {
			var selectEstados = $('#inputEstado');

			selectEstados.empty();
			selectEstados.append('<option value=""></option>');

			estados.forEach(function (estado) {
				var option = $('<option></option>');

				option.val(estado.code);
				option.text(estado.description);

				selectEstados.append(option);
			});


		})
		.catch(function (error) {
			console.log(error);
		})

	function getStatus() {
		return new Promise(function (resolve, reject) {
			var url = "/api/PreOrders/getStatus";

			$.ajax({
				url: url,
				type: "GET",
				success: function (response) {
					var clientes = JSON.parse(response);
					resolve(clientes);
				},
				error: function (xhr, status, error) {
					reject(error);
				}
			});
		});
	}

	getStatus().
		then(function (status) {
			var selectStatus = $('#inputStatus');

			selectStatus.empty();
			selectStatus.append('<option value=""></option>');

			status.forEach(function (status) {
				var option = $('<option></option>');

				option.val(status.codigo);
				option.text(status.descripcion);

				selectStatus.append(option);
			});


		})
		.catch(function (error) {
			console.log(error);
		})

	var table = $('#datatableConsulta').DataTable({
		language: {
			url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
		},
		searching: false,
		buttons: [],
		scrollX: true,
		pagination: true,
		info: true,
		lengthChange: false,
		createdRow: function (row, data, index) {
			$('td:eq(9)', row).addClass('text-end');
			$('td:eq(10)', row).addClass('text-end');
			//$('td', row).addClass('d-flex');
			$('td', row).addClass('align-middle');
			$('td', row).addClass('px-3');

			$('td', row).addClass('text-sm');

			var column0 = $('td:eq(0)', row);
			var id = column0.text();
			var url = '/Ingreso/ViewOrderDraft?id=' + id;

			column0.html('<a href="' + url + '">' + id + '</a>');

			var column9 = $('td:eq(9)', row);
			var column10 = $('td:eq(10)', row);

			var column9Value = column9.html();
			var formattedValue = parseFloat(column9Value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
			var formattedContent = 'S/. ' + formattedValue;
			column9.html(formattedContent);

			var column10Value = column10.html();
			var formattedValue = parseFloat(column10Value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
			var formattedContent = 'S/. ' + formattedValue;
			column10.html(formattedContent);

			var column0 = $('td:eq(0)', row);
			column0.html('<a href="#">' + column0.html() + '</a>');

			var column5 = $('td:eq(6)', row);
			column5.html('<span class="badge border border-success text-success px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center">' + column5.html() + '</span>');

			var column6 = $('td:eq(7)', row);
			column6.html('<span class="badge border border-warning text-warning px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center">' + column6.html() + '</span>');

		},
		initComplete: function () {

		}
	});



	$('#formConsulta').on('submit', function (e) {
		e.preventDefault();

		var parameters = new ConsultaParameters();

		var codigoProducto = $('#inputCodigoProducto').val();
		var nombreCliente = $('#inputNombreCliente').val();
		var status = $('#inputStatus').val();
		var ordenCompra = $('#inputOrdenCompra').val();
		var horaFinal = $('#timepicker-inicio').val();
		var horaInicio = $('#timepicker-final').val();
		var comentario = $('#inputComentario').val();
		var codigoCliente = $('#inputCodigoCliente').val();
		var fechaFormateada = $('#datepicker-inline').val();
		var fechaInicio = formatearFecha(fechaFormateada, 'YYYY-MM-DD');
		var fechaFormateada2 = $('#datepicker-default').val();
		var fechaFinal = formatearFecha(fechaFormateada2, 'YYYY-MM-DD');
		var estado = $('#inputEstado').val();
		var direccion = $('#inputDireccion').val();
		var descripcionArticulo = $('#inputDescripcionProducto').val();
		var vendedor = $('#inputVendedor').val();
		var codigoAlmacen = $('#inputCodigoAlmacen').val();

		parameters.ItemCodeD = codigoProducto;
		parameters.CardName = nombreCliente;
		parameters.StatusDraft = status;
		parameters.OrdenCompra = ordenCompra;
		parameters.OrdenCompraD = '';
		parameters.HoraFinC = formatarHora(horaFinal);
		parameters.Coment = comentario;
		parameters.SlpNameV = '';
		parameters.HoraInicioC = formatarHora(horaInicio);
		parameters.FechaInicioEmision = fechaInicio;
		parameters.FechaFinEmision = fechaFinal;
		parameters.EstadoDraft = estado;
		parameters.Direccion = direccion;
		parameters.CodCliente = codigoCliente;
		parameters.ItemNameD = descripcionArticulo;
		parameters.NombVendedor = vendedor;
		parameters.CodAlmacen = codigoAlmacen;

		$.ajax({
			url: '/api/PreOrders/getConsulta',
			type: 'GET',
			data: parameters,
			success: function (response) {

				var data = JSON.parse(response);

				table.clear();

				var rowsToAdd = [];

				data.forEach(function (rowData) {
					var row = [
						rowData.NroOrden,
						rowData.CodigoCliente,
						rowData.NombreCliente,
						rowData.Fecha,
						rowData.HoraCreacion,
						rowData.Vendedor,
						rowData.Estado,
						rowData.Status,
						rowData.Comentario,
						rowData.SubTotal,
						rowData.Total,
						rowData.DireEntrega,
						rowData.Numero_Entrega
					];

					rowsToAdd.push(row);
				});

				table.rows.add(rowsToAdd).draw(false);

			},
			error: function (error) {
				console.error(error);
				
			}
		});
		

	});

	function formatarHora(hora) {
		var date = new Date('2000/01/01 ' + hora);
		var formattedHora = date.toLocaleTimeString('en-US', {
			hour12: false,
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		}).replace(/:/g, '');
		return formattedHora;
	}

	function formatearFecha(fecha, formato) {
		if (!fecha || fecha.trim() === '') {
			return '';
		}

		var partesFecha = fecha.split('/');
		var dia = partesFecha[1];
		var mes = partesFecha[0];
		var anio = partesFecha[2];

		var fechaFormateada = '';

		switch (formato) {
			case 'YYYY-MM-DD':
				fechaFormateada = anio + '-' + dia + '-' + mes;
				break;
			case 'DD-MM-YYYY':
				fechaFormateada = dia + '-' + mes + '-' + anio;
				break;

			default:
				fechaFormateada = fecha;
				break;
		}

		return fechaFormateada;
	}

	$('#btnPDF').on('click', function (e) {
		e.preventDefault();
		generarPDF();
	});

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

			var docDefinition = {
				pageOrientation: 'landscape',
				content: [
					{ image: dataURL, width: 150 },
					{ text: 'Tabla Ordenes de venta preliminares', style: 'header' },
					{
						table: {
							body: [
								[
									{ text: 'N°', style: 'tableHeader' },
									{ text: 'Código de Cliente', style: 'tableHeader' },
									{ text: 'Nombre de Cliente', style: 'tableHeader' },
									{ text: 'Fecha', style: 'tableHeader' },
									{ text: 'Hora', style: 'tableHeader' },
									{ text: 'Vendedor', style: 'tableHeader' },
									{ text: 'Estado', style: 'tableHeader' },
									{ text: 'Status', style: 'tableHeader' },
									{ text: 'Comentario', style: 'tableHeader' },
									{ text: 'Sub Total', style: 'tableHeader' },
									{ text: 'Total', style: 'tableHeader' },
									{ text: 'Dirección Destino', style: 'tableHeader' },
									{ text: 'Número de entrega', style: 'tableHeader' }
								],
								...tableData.map(function (row) {
									return [
										{ text: row[0], style: 'tableCell', pageBreak: 'auto' },
										{ text: row[1], style: 'tableCell', pageBreak: 'auto' },
										{ text: row[2], style: 'tableCell', pageBreak: 'auto' },
										{ text: row[3], style: 'tableCell', pageBreak: 'auto' },
										{ text: row[4], style: 'tableCell', pageBreak: 'auto' },
										{ text: row[5], style: 'tableCell', pageBreak: 'auto' },
										{ text: row[6], style: 'tableCell', pageBreak: 'auto' },
										{ text: row[7], style: 'tableCell', pageBreak: 'auto' },
										{ text: row[8], style: 'tableCell', pageBreak: 'auto' },
										{ text: row[9], style: 'tableCell', pageBreak: 'auto' },
										{ text: row[10], style: 'tableCell', pageBreak: 'auto' },
										{ text: row[11], style: 'tableCell', pageBreak: 'auto' },
										{ text: row[12], style: 'tableCell', pageBreak: 'auto' }
									];
								})
							],
							headerRows: 1
						},
						style: 'table'
					}
				],
				styles: {
					header: { fontSize: 14, bold: true, margin: [0, 0, 0, 10] },
					tableHeader: { fontSize: 10, bold: true },
					tableCell: { fontSize: 8 }
				}
			};

			pdfMake.createPdf(docDefinition).open();
		};

		imagen.src = "../../img/logo/logo-Hallmark.png";
	}

	/*END generarPDF */

	$('#btnXLS').on('click', function () {
		console.log('XLS');
	});

	class ConsultaParameters {
		constructor() {
			this.ItemCodeD = '';
			this.CardName = '';
			this.StatusDraft = '';
			this.OrdenCompra = '';
			this.OrdenCompraD = '';
			this.HoraFinC = '';
			this.Coment = '';
			this.SlpNameV = '';
			this.HoraInicioC = '';
			this.FechaInicioEmision = '';
			this.FechaFinEmision = '';
			this.EstadoDraft = '';
			this.Direccion = '';
			this.CodCliente = '';
			this.ItemNameD = '';
			this.NombVendedor = '';
			this.CodAlmacen = '';
		}
	}


};

var handleRenderDatepicker = function() {
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
	function getCustomerList() {
		return new Promise(function (resolve, reject) {
			var url = "/api/customer/getCustomerList2";

			$.ajax({
				url: url,
				type: "GET",
				success: function (response) {
					var clientes = JSON.parse(response);
					resolve(clientes);
				},
				error: function (xhr, status, error) {
					reject(error);
				}
			});
		});
	}


	getCustomerList()
		.then(function (clientes) {

			var clientes_codigo = [];
			var clientes_nombre = [];

			clientes.forEach(function (cliente) {
				clientes_codigo.push(cliente.Codigo_Cliente);
				clientes_nombre.push(cliente.Nombre_Cliente);
			});


			$.typeahead({
				input: '#inputCodigoCliente',
				order: "desc",
				source: {
					data: clientes_codigo
				},
				minLength: 3
			});

			$.typeahead({
				input: '#inputNombreCliente',
				order: "desc",
				source: {
					data: clientes_nombre
				},
				minLength: 3
			});

		})
		.catch(function (error) {
			console.log(error);
		});
};


/* Controller
------------------------------------------------ */
$(document).ready(function () {

	handleRenderTimepicker();

	handleRenderTableData();
	handleRenderDatepicker();
	handleRenderTypeahead();
});