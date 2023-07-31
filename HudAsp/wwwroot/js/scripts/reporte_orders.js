var handleRenderDatepicker = function () {
	$('#inputFechaFinal').datepicker({
		autoclose: true,
		format: 'dd/mm/yyyy'
	}).datepicker("setDate", new Date());


	$('#inputfechaInicio').datepicker({
		autoclose: true,
		format: 'dd/mm/yyyy'
	});
};
var handleRenderTableData = function () {

	var table = $('#datatableReporte').DataTable({
		language: {
			url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
		},
		searching: false,
		pageLength: 100,
		buttons: [],
		scrollX: true,
		pagination: true,
		info: true,
		lengthChange: false,
		createdRow: function (row, data, index) {
			$('td:eq(9)', row).addClass('text-end');
			$('td:eq(10)', row).addClass('text-end');
			$('td', row).addClass('align-middle');
			$('td', row).addClass('px-3');

			$('td', row).addClass('text-sm');
		},
		initComplete: function () {

		}
	});

	$('#formReporte').on('submit', function (e) {
		e.preventDefault();

		var parameters = new ReporteParameters();

		var codAlmacen = $('#inputAlmacen').val();

		var fechaFormateada = $('#inputfechaInicio').val();
		var fechaInicio = formatearFecha(fechaFormateada, 'YYYY-MM-DD');
		var fechaFormateada2 = $('#inputFechaFinal').val();
		var fechaFinal = formatearFecha(fechaFormateada2, 'YYYY-MM-DD');

		parameters.FechaInicioEmision = fechaInicio;
		parameters.FechaFinEmision = fechaFinal;
		parameters.CodAlmacen = codAlmacen;

		console.log(parameters);

		
		$.ajax({
			url: '/api/PreOrders/getReporte',
			type: 'GET',
			data: parameters,
			success: function (response) {

				var data = JSON.parse(response);

				table.clear();

				var rowsToAdd = [];

				data.forEach(function (rowData) {
					var row = [
						rowData.Tipo,
						rowData.NumInterno,
						rowData.NumeroDocumento,
						rowData.NumeroFiscal,
						rowData.FechaContabilizacion,
						rowData.NombreCliente,
						rowData.NumeroLinea,
						rowData.NumArticulo,
						rowData.CodBarra,
						rowData.DescripcionArticulo,
						rowData.Cantidad,
						rowData.CodAlmacen,
						rowData.NumeroLote,
						rowData.FechaVencimiento
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
				fechaFormateada = '';
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
					{ text: 'Reporte', style: 'header' },
					{
						table: {
							body: [
								[
									{ text: 'Tipo de documento', style: 'tableHeader' },
									{ text: 'Número interno', style: 'tableHeader' },
									{ text: 'Número de documento', style: 'tableHeader' },
									{ text: 'Número fiscal', style: 'tableHeader' },
									{ text: 'Fecha de contabilización', style: 'tableHeader' },
									{ text: 'Nombre de Cliente', style: 'tableHeader' },
									{ text: 'Número de línea', style: 'tableHeader' },
									{ text: 'Número de artículo', style: 'tableHeader' },
									{ text: 'Código de barras', style: 'tableHeader' },
									{ text: 'Descripción de artículo', style: 'tableHeader' },
									{ text: 'Cantidad', style: 'tableHeader' },
									{ text: 'Código de almacén', style: 'tableHeader' },
									{ text: 'Número de lote', style: 'tableHeader' },
									{ text: 'Fecha de vencimiento', style: 'tableHeader' }
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
										{ text: row[12], style: 'tableCell', pageBreak: 'auto' },
										{ text: row[13], style: 'tableCell', pageBreak: 'auto' }
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
		var csvData = Array.from(document.querySelectorAll('#cabecera th'))
			.map(th => th.textContent.trim())
			.map(header => removeAccents(header))
			.join(';') + '\n';

		csvData += table
			.rows()
			.data()
			.filter(row => row.length > 0)
			.map(row => row.map(cell => cell.replace(/\r\r/g, ' ')))
			.map(row => row.map(cell => cell.replace(/\r/g, ' ')))
			.map(row => row.map(cell => removeAccents(cell)))
			.map(row => row.join(';').replace(/"/g, ''))
			.join('\n');

		var link = document.createElement('a');
		link.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvData);
		link.download = 'reporte';
		link.style.display = 'none';
		document.body.appendChild(link);

		link.click();

		document.body.removeChild(link);
	});

	function removeAccents(text) {
		return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
	}


	class ReporteParameters {
		constructor() {
			this.FechaInicioEmision = '';
			this.FechaFinEmision = '';
			this.CodAlmacen = '';
		}
	}


	function getAlmacenesList() {
		return new Promise(function (resolve, reject) {
			var url = "/api/PreOrders/getAlmacenes";

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

	getAlmacenesList()
		.then(function (almacenes) {

			var cods = [];

			almacenes.forEach(function (almacen) {
				cods.push(almacen.CodAlm);
			});

			$.typeahead({
				input: '#inputAlmacen',
				order: "desc",
				source: {
					data: cods
				},
				minLength: 3
			});


		});


};

/* Controller
------------------------------------------------ */
$(document).ready(function () {
	handleRenderTableData();
	handleRenderDatepicker();
});