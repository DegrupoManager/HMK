
var handleRenderTableData = function () {

	$('#btnImprimir').on('click', function () {
		generarFacturaPDF();
	});

	$('#exportCSV').on('click', function () {

		var csvData = Array.from(document.querySelectorAll('#cabecera th'))
			.map(th => th.textContent.trim())
			.map(header => removeAccents(header))
			.join(';') + '\n';

		var rows = document.querySelectorAll('#detalleRow tr');
		rows.forEach(row => {
			var rowData = Array.from(row.querySelectorAll('input'))
				/*.map(input => input.getAttribute('value'))*/
				.map(input => input.value)
				.map(cell => cell.replace(/\r\r/g, ' ').replace(/\r/g, ' '))
				.map(cell => removeAccents(cell))
				.join(';').replace(/"/g, '');

			csvData += rowData + '\n';
		});

		var link = document.createElement('a');
		link.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvData);
		link.download = 'detalle';
		link.style.display = 'none';
		document.body.appendChild(link);

		link.click();

		document.body.removeChild(link);
	});


	function generarFacturaPDF() {

		var orderData = $('#orderData').data('order');

		var datosCabecera = [];
		var detalle = [];

		var imagen = new Image();
		var dataURL;

		imagen.onload = function () {
			var elCanvas = document.createElement("canvas");
			var ctx = elCanvas.getContext("2d");
			ctx.drawImage(imagen, 0, 0);
			dataURL = elCanvas.toDataURL("image/png");

			datosCabecera.push({
				"NombreCliente": orderData[0].NombreCliente || '',
				"DireEntrega": removeNewlines(orderData[0].DireEntrega) || '',
				"FechaContabilizacion": obtenerFechaSinHora(orderData[0].FechaContabilizacion) || '',
				"Moneda": orderData[0].MonedaDescripcion || '',
				"Vendedor": orderData[0].Vendedor || '',
				"NumRef": orderData[0].NumRef || '',
				"NroOrden": orderData[0].NroOrden || '',
				"Comentario": orderData[0].Comentario || '',
				"RUC": orderData[0].RUC || '',
				"OrdenDeCompra": orderData[0].OrdenDeCompra || '',
				"Monto": orderData[0].Monto || '',
				"TotalImpuesto": orderData[0].TotalImpuesto || '',
				"SubTotal": removeMinusSign(orderData[0].SubTotal) || ''
			});

			for (var i = 0; i < orderData.length; i++) {
				detalle.push({
					"CodArticulo": orderData[i].CodArticulo || '',
					"CodSunat": orderData[i].CodSUNAT || '',
					"Descripcion": orderData[i].Descripcion || '',
					"UM": orderData[i].UM || '',
					"Cantidad": orderData[i].Cantidad ||'',
					"PrecioUnitario": orderData[i].PrecioVentUnit || '',
					"ValorUnitario": orderData[i].ValorVentUnit || '',
					"TotalLinea": orderData[i].TotalLinea || ''
				});
			}

			var cabecera1 = [
				{
					border: [true, true, false, false],
					stack: [
						{
							image: dataURL,
							margin: [0, 0, 125, 0],
							width: 200
						}						
					],
					margin: [10, 10, 0, 0],
				},
				{
					border: [false, true, true, false],
					table: {
						body: [
							[
								{ text: 'RUC: 20427643612', alignment: 'center', border: [true, true, true, false], }
							],
							[
								{text: 'ORDEN DE VENTA PRELIMINAR', alignment: 'center', border: [true, false, true, false], bold: true}
							],
							[
								{ text: `${orderData[0].NroOrden}`, alignment: 'center', border: [true, false, true, true] }
							]
						]
					},
					margin: [0, 10, 10, 0],
				}
			];

			var cabecera2 = [
				{
					border: [true, false, true, false],
					colSpan: 2,
					stack: [
						{
							text: 'HALLMARK S.A.',
							bold: true,
							fontSize: 11
						},
						{
							text: 'CAL LAS MAGNOLIAS MZA G-1 LOTE 06 SEC. LA CAPITANA LURINGACHO\n- LIMA - LIMA - PERÚ',
							fontSize: 9
						}
					]
				}
			];

			var cabecera3 = [
				{
					border: [true, false, true, false],
					colSpan: 2,
					table: {
						widths: ['*', '*', '*', '*'],
						body: [
							[
								{ text: 'Cliente', border: [true, true, false, false], bold: true, fontSize: 8 }, { text: `: ${datosCabecera[0].NombreCliente}`, colSpan: 3, fontSize: 8, border: [false, true, true, false], },
								{}, {},
							],
							[
								{ text: 'Dirección', bold: true, fontSize: 8, border: [true, false, false, false], }, { text: `: ${datosCabecera[0].DireEntrega}`, colSpan: 3, fontSize: 8, border: [false, false, true, false] },
								{}, {},
							],
							[
								{ text: 'RUC', bold: true, fontSize: 8, border: [true, false, false, false], }, { text: `: ${datosCabecera[0].RUC}`, colSpan: 3, fontSize: 8, border: [false, false, true, false] },
								{}, {},
							],
							[
								{ text: 'Fecha de Emisión', bold: true, fontSize: 8, border: [true, false, false, false] }, { text: `: ${datosCabecera[0].FechaContabilizacion}`,  fontSize: 8, border: [false, false, false, false] },
								{ text: 'Moneda', bold: true, fontSize: 8, border: [false, false, false, false] }, { text: `: ${datosCabecera[0].Moneda}`,  fontSize: 8, border: [false, false, true, false] }
							],
							[
								{ text: '', border: [true, false, false, true] }, { text: '', border: [false, false, false, true] },
								{ text: 'Vendedor', bold: true, fontSize: 8, border: [false, false, false, true] }, { text: `: ${datosCabecera[0].Vendedor}`, fontSize: 8, border: [false, false, true, true] }
							]
						],
					},
				},
			];

			const cabecera4 = [
				{
					border: [true, false, true, false],
					colSpan: 2,
					table: {
						widths: ['*', '*', '*', '*'],
						body: [
							[
								{ text: 'Nro. Orden de Compra', bold: true, fontSize: 8, border: [true, true, false, true], noWrap: true },
								{ text: `: ${datosCabecera[0].OrdenDeCompra}`, fontSize: 8, border: [false, true, true, true], noWrap: true, colSpan: 3 },
								'',''
							]
						],
					},
				},
			];


			var tablaDetalle = [
				{
					border: [true, false, true, false],
					colSpan: 2,
					table: {
						widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto'],
						//headerRows: 1,
						body: [
							[
								{ text: 'Código', bold: true, fontSize: 8 },
								{ text: 'Código\nSUNAT', bold: true, fontSize: 8 },
								{ text: 'Descripción', bold: true, fontSize: 8 },
								{ text: 'U.M.', bold: true, fontSize: 8 },
								{ text: 'Cantidad', bold: true, fontSize: 8 },
								{ text: 'Precio Venta\nUnitario', bold: true, fontSize: 8 },
								{ text: 'Valor Venta\nUnitario', bold: true, fontSize: 8 },
								{ text: 'Valor\nTotal', bold: true, fontSize: 8 }
							],
							...detalle.map(item => [
								{ text: item.CodArticulo, fontSize: 8 },
								{ text: item.CodSunat, fontSize: 8 },
								{ text: item.Descripcion, fontSize: 8 },
								{ text: item.UM, fontSize: 8 },
								{ text: item.Cantidad, fontSize: 8, alignment: 'right' },
								{ text: item.PrecioUnitario, fontSize: 8, alignment: 'right' },
								{ text: item.ValorUnitario, fontSize: 8, alignment: 'right' },
								{ text: item.TotalLinea, fontSize: 8, alignment: 'right' }
							]),
							[
								{ text: '', colSpan: 3, border: [false, true, true, false], },
								'', '',
								{ text: 'Total Valor de Venta - Operaciones Gravadas', fontSize: 8, colSpan: 4 },
								'', '', '',
								{ text: `S/. ${datosCabecera[0].SubTotal}`, fontSize: 8, noWrap: true, alignment: 'right' }
							],
							[
								{ text: '', colSpan: 3, border: [false, false, true, false], },
								'', '',
								{ text: 'IGV (18.00%)', fontSize: 8, colSpan: 4 },
								'', '', '',
								{ text: `S/. ${datosCabecera[0].TotalImpuesto}`, fontSize: 8, noWrap: true, alignment: 'right' }
							],
							[
								{ text: '', colSpan: 3, border: [false, false, true, false], },
								'', '',
								{ text: 'Importe Total', fontSize: 8, colSpan: 4 },
								'', '', '',
								{ text: `S/. ${datosCabecera[0].Monto}`, fontSize: 8, noWrap: true, alignment: 'right' }
							]
						]
					}
				}
			];

			var observaciones = [
				{
					border: [true, false, true, true],
					colSpan: 2,
					table: {
						widths: ['auto', '*'],
						body: [
							[
								{ text: 'Comentario', bold: true, fontSize: 8, border: [true, true, false, true]},
								{ text: `${datosCabecera[0].Comentario}`, bold: true, fontSize: 8, border: [false, true, true, true] }
							]
						]
					}
				}
			];

			const docDefinition = {
				pageSize: 'A4',
				pageMargins: [22, 22, 22, 22],
				content: [
					{
						table: {
							body: [
								cabecera1,
								cabecera2,
								cabecera3,
								cabecera4,
								tablaDetalle,
								observaciones
							],
							layout: {
								defaultBorder: false,
								widths: [100, 'auto', 'auto', 150]
							},
						},
					},
				],
				styles: {
					detalleTable: {
						fontSize: 8
					}
				}
			};

			pdfMake.createPdf(docDefinition).open();
		};

		imagen.src = "../../img/logo/logo-Hallmark.png";
	}




	function removeAccents(text) {
		return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
	}

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
	function removeMinusSign(inputNumber) {
		return parseFloat(inputNumber.replace(/^-/, ''));
	}

	function removeNewlines(inputString) {
		return inputString.replace(/\n/g, '');
	}

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
					<input value="${item.Descripcion}" type="text" class="form-control bg-inverse bg-opacity-10 custom-table-form text-start" name="inputDescripcionArticulo${counter}" id="inputDescripcionArticulo${counter}" data-column="${counter}"
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