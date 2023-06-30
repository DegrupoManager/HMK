
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

	//console.log($('#datepicker-default').val());

	$('#datepicker-component').datepicker({
		autoclose: true,
		format: 'dd/mm/yyyy'
	}).datepicker("setDate", new Date());

	$('#datepicker-range').datepicker({
		autoclose: true,
		format: 'dd/mm/yyyy'
	});

	$('#datepicker-inline').datepicker({
		autoclose: true,
		format: 'dd/mm/yyyy'
	}).datepicker("setDate", new Date());

};
var handleRenderTypeahead = function () {

	/*
	function getCustomerById(customerCode) {
		var url = "/api/customer/getCustomerById";
		var parameters = {
			customerCode: customerCode
		};

		$.ajax({
			url: url,
			type: "GET",
			data: parameters,
			success: function (response) {
				var dataClientes = JSON.parse(response);
				console.log(dataClientes);
				return dataClientes;
			},
			error: function (xhr, status, error) {
				
				console.log(error);
			}
		});
	}


	console.log(getCustomerById(4089));*/

	function getCustomerById(customerCode) {
		return new Promise(function(resolve, reject) {
			var url = "/api/customer/getCustomerById";
			var parameters = {
				customerCode: customerCode
			};

			$.ajax({
				url: url,
				type: "GET",
				data: parameters,
				success: function(response) {
					var dataClientes = JSON.parse(response);
					resolve(dataClientes);
				},
				error: function(xhr, status, error) {
					reject(error);
				}
			});
		});
	}


	$('#inputCodigoCliente').on('input', function () {

		var codigoCliente = $(this).val();


		if (codigoCliente.length >= 3) {

			getCustomerById(codigoCliente)
				.then(function (dataClientes) {
					var uniqueCodigoClienteData = dataClientes.reduce(function (acc, current) {
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
							data: [
								uniqueCodigoClienteData
							]
						},
						minLength: 3
					});

					/*BEGIN autocompletado */
					//$('.typeahead__query .input-group-text')
					$('#porCodigoCliente').on('click', function () {
						var codigoCliente = $('#inputCodigoCliente').val();

						var direccionesDestinoFiltradas = dataClientes.filter(function (item) {
							return item.Codigo_Cliente === codigoCliente;
						}).map(function (item) {
							return item.Direccion_Destino;
						});

						var direccionesFacturaFiltradas = dataClientes.filter(function (item) {
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

						var campo = dataClientes.filter(function (item) {
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
					});

					/*END autocompletado */

				})
				.catch(function (error) {
					console.log(error);
				});

			
			//$.typeahead({
			//	input: '#inputCodigoCliente',
			//	order: "desc",
			//	source: {
			//		data: [
			//			uniqueCodigoClienteData
			//		]
			//	},
			//	minLength: 2
			//});

			///*BEGIN autocompletado */
			////$('.typeahead__query .input-group-text')
			//$('#porCodigoCliente').on('click', function () {
			//	var codigoCliente = $('#inputCodigoCliente').val();

			//	var direccionesDestinoFiltradas = clientePorCodigo.filter(function (item) {
			//		return item.Codigo_Cliente === codigoCliente;
			//	}).map(function (item) {
			//		return item.Direccion_Destino;
			//	});

			//	var direccionesFacturaFiltradas = clientePorCodigo.filter(function (item) {
			//		return item.Codigo_Cliente === codigoCliente;
			//	}).map(function (item) {
			//		return item.Direccion_Factura;
			//	});

			//	$('#inputDireccionDestino').empty();
			//	$('#inputDestinatarioFactura').empty();

			//	direccionesDestinoFiltradas.forEach(function (direccion) {
			//		var option = $('<option></option>').text(direccion);
			//		$('#inputDireccionDestino').append(option);
			//	});

			//	direccionesFacturaFiltradas.forEach(function (direccion) {
			//		var option = $('<option></option>').text(direccion);
			//		$('#inputDestinatarioFactura').append(option);
			//	});

			//	var campo = clientePorCodigo.filter(function (item) {
			//		return item.Codigo_Cliente === codigoCliente;
			//	});

			//	console.log(campo);

			//	if (campo.length > 0) {
			//		$('#inputNombreCliente').val(campo[0].Nombre_Cliente);
			//		$('#inputPersonaContacto').val(campo[0].Persona_contacto);
			//		$('#inputCondicionPago').val(campo[0].Condicion_pago);
			//	} else {
			//		$('#inputNombreCliente').val('');
			//		$('#inputPersonaContacto').val('');
			//		$('#inputCondicionPago').val('');
			//	}
			//});
			
			///*END autocompletado */
			
		} else {
			// Vaciar los campos si el input está vacío
			$('#inputNombreCliente').val('');
			$('#inputPersonaContacto').val('');
			$('#inputCondicionPago').val('');
			$('#inputDireccionDestino').empty();
			$('#inputDestinatarioFactura').empty();
		}
	});

	/*BEGIN codArticulo*/

	/*BEGIN Serie documento */
	function getSerieDoc(serieCode) {
		return new Promise(function (resolve, reject) {
			var url = "/api/draft/getSerieDoc";
			var parameters = {
				serieCode: serieCode
			};

			$.ajax({
				url: url,
				type: "GET",
				data: parameters,
				success: function (response) {
					var dataCorrelativo = JSON.parse(response);

					resolve(dataCorrelativo);
				},
				error: function (xhr, status, error) {
					reject(error);
				}
			});
		});
	}


	function getSerieList() {
		return new Promise(function (resolve, reject) {
			var url = "/api/draft/getSerieList";

			$.ajax({
				url: url,
				type: "GET",
				success: function (response) {
					var dataSerieList = JSON.parse(response);

					resolve(dataSerieList);
				},
				error: function (xhr, status, error) {
					reject(error);
				}
			});
		});
	}

	function primeraSerie() {
		getSerieList()
			.then(function (Series) {

				var selectElement = $('#inputSerieDoc');

				selectElement.empty();

				Series.forEach(function (serie) {
					var option = $('<option></option>');

					option.val(serie.CodSerie);
					option.text(serie.NombreSerie);

					selectElement.append(option);
				});

				getSerieDoc(Series[0].CodSerie)
					.then(function (serie) {

						$('#inputCorrelativo').val(serie[0].Correlativo);

					})
					.catch(function (error) {
						console.log(error);
					});

			})
			.catch(function (error) {
				console.log(error);
			});
	}

	primeraSerie();
	/*END Serie documento */

	//$('#inputCodigoArticulo1').on('input', function () {

	//	var codigoArticulo = $(this).val();

	//	console.log(codigoArticulo)

	//	if (codigoArticulo.length >= 3) {

	//		var clientes = [];

	//		getProductById(codigoArticulo)
	//			.then(function (dataArticulos) {
	//				var uniqueCodigoClienteData = dataArticulos.reduce(function (acc, current) {
	//					var codigoCliente = current.CodigoArticulo;
	//					if (!acc.includes(codigoCliente)) {
	//						acc.push(codigoCliente);
	//					}
	//					return acc;
	//				}, []);

	//				console.log(uniqueCodigoClienteData);


	//				/*BEGIN autocompletado */
	//				//$('.typeahead__query .input-group-text')
	//				$('#porCodigoArticulo').on('click', function () {
	//					var codigoArticulo = find('[id^=inputDescripcionArticulo]').val();

	//					console.log(codigoArticulo);

	//					if (campo.length > 0) {
	//						$('#inputNombreCliente').val(campo[0].Nombre_Cliente);
	//						$('#inputPersonaContacto').val(campo[0].Persona_contacto);
	//						$('#inputCondicionPago').val(campo[0].Condicion_pago);
	//					} else {
	//						$('#inputNombreCliente').val('');
	//						$('#inputPersonaContacto').val('');
	//						$('#inputCondicionPago').val('');
	//					}
	//				});

	//				/*END autocompletado */

	//			})
	//			.catch(function (error) {
	//				console.log(error);
	//			});

	//	} else {
	//		// Vaciar los campos si el input está vacío
	//		$('#inputNombreCliente').val('');
	//		$('#inputPersonaContacto').val('');
	//		$('#inputCondicionPago').val('');
	//		$('#inputDireccionDestino').empty();
	//		$('#inputDestinatarioFactura').empty();
	//	}
	//});

	/*END codArticulo*/

	/*
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
	*/


	/*
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
	*/
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
			url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
		},
		dom: domHTML,
		ordering: false,
		buttons: [],
		scrollX: true,
		initComplete: function () {

			$('#pBuscar').append(busquedaHTML);
			$('#pBoton').append(btnHTML);

			var cuentaFilas = [];
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
                        <span id="porCodigoArticulo" data-index="${counter}" class="input-group-text porCodigoArticulo"><i class="fa-solid fa-magnifying-glass"></i></span>
                        <input class="form-control searchable codigoArticulo" placeholder="A00001" name="inputCodigoArticulo${counter}" id="inputCodigoArticulo${counter}" data-column="${counter}">
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


			/*BEGIN busqueda en input */
			$.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
				var row = table.row(dataIndex).node();
				var inputs = $(row).find('.input-group input');
				var searchValue = $('#busquedaCustom').val().toLowerCase();

				var matches = inputs.toArray().some(function (input) {
					var inputValue = $(input).val().toLowerCase();
					return inputValue.includes(searchValue);
				});

				return matches;
			});

			$('#busquedaCustom').on('keyup', function () {
				table.draw();
			});
			/*END busqueda en input */


			$(document).on('click', '.porCodigoArticulo', function () {
				var index = $(this).data('index');

				var codigoArticulo = $(`#inputCodigoArticulo${index}`).val();
				console.log(codigoArticulo)

				getProductById(codigoArticulo)
					.then(function (dataArticulo) {

						console.log(dataArticulo);

						$(`#inputDescripcionArticulo${index}`).val(dataArticulo[0].DescripcionArticulo);
						$(`#inputCodigoBarras${index}`).val(dataArticulo[0].CodigoBarra);

					})
					.catch(function (error) {
						console.log(error);
					});

			});
			/*
			$('#porCodigoArticulo').on('click', function () {

				var index = $(this).data('index');

				var codigoArticulo = $('#inputCodigoArticulo').val();
				console.log(codigoArticulo)

				getProductById(codigoArticulo)
					.then(function (dataClientes) {

						console.log(dataClientes);

						$('#inputDescripcionArticulo1').val(dataClientes[0].CodigoBarra);
						$('#inputCodigoBarras1').val(dataClientes[0].DescripcionArticulo);

					})
					.catch(function (error) {
						console.log(error);
					});

			});
			*/

		}
	});

	function getProductById(productCode) {
		return new Promise(function (resolve, reject) {
			var url = "/api/product/getProductById";
			var parameters = {
				productCode: productCode
			};

			$.ajax({
				url: url,
				type: "GET",
				data: parameters,
				success: function (response) {
					var dataArticulos = JSON.parse(response);
					//console.log(dataArticulos);
					resolve(dataArticulos);
				},
				error: function (xhr, status, error) {
					reject(error);
				}
			});
		});
	}

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

			default:
				fechaFormateada = fecha;
				break;
		}

		return fechaFormateada;
	}


	//$(document).on('click', '#formNewOrderDraft input[type="submit"]', function (e) {
	$("#formNewOrderDraft").on("submit", function (e) {

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

		var nuevaOrdenPreliminar = new OrdenPreliminar(codigo, personaContacto, numeroReferencia, direccionDestino, destinatarioFactura, moneda, fechaContabilizacion, fechaEntrega, fechaDocumento, condicionPago, comentario);

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

		/*
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
		});*/

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