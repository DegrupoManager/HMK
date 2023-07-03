
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

	function getCustomerList(){
		return new Promise(function (resolve, reject) {
			var url = "/api/customer/getCustomerList";

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

		});

	/*BEGIN porCodigoCliente */
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

	function getPersonContactsByCustomerId(customerCode) {
		return new Promise(function (resolve, reject) {
			var url = "/api/customer/getPersonContactsByCustomerId";
			var parameters = {
				customerId: customerCode
			};

			$.ajax({
				url: url,
				type: "GET",
				data: parameters,
				success: function (response) {
					var dataClientes = JSON.parse(response);
					resolve(dataClientes);
				},
				error: function (xhr, status, error) {
					reject(error);
				}
			});
		});
	}

	function vaciarCabecera() {

		$('#inputNombreCliente').val('');

		var personaContacto = $('#inputPersonaContacto');
		personaContacto.empty();

		$('#inputCondicionPago').val('');
		$('#inputMoneda').val('');
		$('#inputNumeroReferencia').val('');

		var direccionDestino = $('#inputDireccionDestino');
		direccionDestino.empty();
		$('#textAreaDireccionDestino').val('');

		var destinatarioFactura = $('#inputDestinatarioFactura');
		destinatarioFactura.empty();
		$('#textAreaDestinatarioFactura').val('');
	}

	$("#inputCodigoCliente").on("input", function () {
		if ($(this).val() === "") {
			console.log("No hay data1");
			vaciarCabecera();
		}
	});

	// Obtener el elemento span
	var cancelButton = $(".typeahead__cancel-button");

	// Agregar el ID al elemento
	cancelButton.attr("id", "cerrarCodigoCliente");

	$("#inputCodigoCliente").on("#cerrarCodigoCliente", function () {
		console.log('hola');
		if ($(this).val() === "") {
			console.log("No hay data");
		}
	});

	$('#porCodigoCliente').on('click', function () {
			
		var codigoCliente = $('#inputCodigoCliente').val();

		if (codigoCliente.length > 0) {
			getCustomerById(codigoCliente)
				.then(function (dataCliente) {

					/*BEGIN Autocompletar */
					
					$('#inputNombreCliente').val(dataCliente.Nombre_Cliente);

					var personaContacto = $('#inputPersonaContacto');
					personaContacto.append(`<option value="${dataCliente.contactoCodigo}" selected>${dataCliente.contactoNombre}</option>`);

					$('#inputCondicionPago').val(dataCliente.Condicion_pago);
					$('#inputMoneda').val(dataCliente.Moneda);
					$('#inputNumeroReferencia').val(dataCliente.Numero_Referencia);

					var direccionDestino = $('#inputDireccionDestino');
					direccionDestino.append(`<option value="${dataCliente.direccionDestinoCodigo}" selected>${dataCliente.direccionDestinoCodigo}</option>`);
					$('#textAreaDireccionDestino').val(dataCliente.Direccion_Destino);

					var destinatarioFactura = $('#inputDestinatarioFactura');
					destinatarioFactura.append(`<option value="${dataCliente.direccionFacturaCodigo}" selected>${dataCliente.direccionFacturaCodigo}</option>`);
					$('#textAreaDestinatarioFactura').val(dataCliente.Direccion_Factura);

					/*END Autocompletar */

					getPersonContactsByCustomerId(codigoCliente)
						.then(function (dataContacto) {
							dataContacto.forEach(function (contacto) {
								if (contacto.codigo !== dataCliente.contactoCodigo) {
									personaContacto.append(`<option value="${contacto.codigo}" selected>${contacto.nombreCompleto}</option>`);
									console.log('funcionó');
								}
							});
						})
						.catch(function (error) {
							console.log(error);
						});
					
				})
				.catch(function (error) {
					console.log(error); 
				});
		}
	});

	/*
	$('#inputCodigoCliente').on('input', function (event) {

		$('#inputNombreCliente').val('')
		$('#inputPersonaContacto').val('');
		$('#inputCondicionPago').val('');
		$('#inputMoneda').val('');
		$('#inputNumeroReferencia').val('');

		var direccionDestino = $('#inputDireccionDestino');
		direccionDestino.empty();
		$('#textAreaDireccionDestino').val('');

		var destinatarioFactura = $('#inputDestinatarioFactura');
		destinatarioFactura.empty();
		$('#textAreaDestinatarioFactura').val('');

	});*/

	/*END porCodigoCliente*/


	/*BEGIN porNombreCliente */

	$('#porNombreCliente').on('click', function () {
		
		var nombreCliente = $('#inputNombreCliente').val();

		getCustomerList()
			.then(function (clientes) {

				var codigoClienteEncontrado;
				clientes.forEach(function (cliente) {
					if (cliente.Nombre_Cliente === nombreCliente) {
						codigoClienteEncontrado = cliente.Codigo_Cliente;
						return;
					}
				});

				console.log(codigoClienteEncontrado);

				if (codigoClienteEncontrado !== null) {

					getCustomerById(codigoClienteEncontrado)
						.then(function (dataClientes) {

							console.log(dataClientes);

							/*BEGIN autocompletado */
						
							if (nombreCliente.length > 0) {

								$('#inputCodigoCliente').val(dataClientes[0].Codigo_Cliente);
								$('#inputPersonaContacto').val(dataClientes[0].Persona_contacto);
								$('#inputCondicionPago').val(dataClientes[0].Condicion_pago);
								$('#inputMoneda').val(dataClientes[0].Moneda);
								$('#inputNumeroReferencia').val(dataClientes[0].Numero_Referencia);
								$('#textAreaDireccionDestino').val(dataClientes[0].Direccion_Destino);
								$('#textAreaDestinatarioFactura').val(dataClientes[0].Direccion_Factura);

							} else {
								$('#inputPersonaContacto').val('');
								$('#inputCondicionPago').val('');
								$('#inputMoneda').val('');
								$('#inputDireccionDestino').empty();
								$('#inputDestinatarioFactura').empty();
								$('#inputNumeroReferencia').val('');
								$('#textAreaDireccionDestino').val('');
								$('#textAreaDestinatarioFactura').val('');
							}

						/*END autocompletado */

						})
						.catch(function (error) {
							console.log(error);
						});

				} else {
					console.log('Cliente no encontrado');
				}


			})
			.catch(function (error) {
				console.log(error);
			});
		
	});

	/*END porNombreCliente*/


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
		constructor(ItemCode, WarehouseCode, UnitPrice, Quantity, DiscountPercent, VatGroup) {
			this.ItemCode = ItemCode;
			this.WarehouseCode = WarehouseCode;
			this.UnitPrice = UnitPrice;
			this.Quantity = Quantity;
			this.DiscountPercent = DiscountPercent;
			this.VatGroup = VatGroup;
		}
	}

	class OrdenPreliminar {
		constructor(CardCode, ContactPersonCode, NumAtCard, ShipToCode, PayToCode, DocCurrency, DocDate, DocDueDate, TaxDate, GroupNum, Comments, Series, U_DGP_OwnerCode) {
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
			this.Series = Series;

			this.U_DGP_OwnerCode = U_DGP_OwnerCode;
			this.DocumentLines = [];
		}

		addDocumentLine(ItemCode, WarehouseCode, UnitPrice, Quantity, DiscountPercent, VatGroup) {
			const documentLine = new DocumentLine(ItemCode, WarehouseCode, UnitPrice, Quantity, DiscountPercent, VatGroup);
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

			var articulos_codigo = [];
			var articulos_descripcion = [];

			getProductList()
				.then(function (articulos) {
					articulos.forEach(function (articulo) {
						articulos_codigo.push(articulo.CodigoArticulo);
						articulos_descripcion.push(articulo.DescripcionArticulo);
					});

					botonAgregar.click();
				})
				.catch(function (error) {
					console.log(error);
				});

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
					<div class="typeahead__container">
						<div class="typeahead__field">
							<div class="typeahead__query input-group px-2">
								<span id="porCodigoArticulo" data-index="${counter}" class="input-group-text porCodigoArticulo"><i class="fa-solid fa-magnifying-glass"></i></span>
								<input type="text" class="form-control searchable codigoArticulo" name="inputCodigoArticulo${counter}" id="inputCodigoArticulo${counter}" data-column="${counter}" autocomplete="off" required>
							</div>
						</div>
					</div>
				`;

				var input02 = `
					<div class="typeahead__container">
						<div class="typeahead__field">
							<div class="typeahead__query input-group px-2">
								<span id="porNombreArticulo" data-index="${counter}" class="input-group-text porCodigoArticulo"><i class="fa-solid fa-magnifying-glass"></i></span>
								<input type="text" class="form-control descripcionArticulo" name="inputDescripcionArticulo${counter}" id="inputDescripcionArticulo${counter}" data-column="${counter}" autocomplete="off" required>
							</div>
						</div>
					</div>
				`;

				var input03 = `
				<div class="typeahead__container">
						<div class="typeahead__field">
							<div class="typeahead__query input-group px-3">
								<span id="" data-index="${counter}" class="input-group-text porCodigoArticulo"><i class="fa-solid fa-magnifying-glass"></i></span>
								<input type="text" class="form-control" name="inputCodigoAlmacen${counter}" id="inputCodigoAlmacen${counter}" data-column="${counter}" autocomplete="off" required>
							</div>
						</div>
					</div>
				`;

				var input03X = `
					<div class="input-group px-3">
                        <span class="input-group-text"><i class="fa-solid fa-magnifying-glass"></i></span>
                        <input class="form-control" name="inputCodigoAlmacen${counter}" id="inputCodigoAlmacen${counter}">
                    </div>
				`;

				var input04 = `
					<div class="input-group px-4">
                        <input class="form-control bg-inverse bg-opacity-10" id="inputCantidadAlmacen${counter}" style="text-align: center;" disabled>
                    </div>
				`;

				var input05 = `
					<div class="input-group px-2">
                        <input class="form-control bg-inverse bg-opacity-10" id="inputStockAlmacen${counter}" style="text-align: center;" disabled>
                    </div>
				`;

				var input06 = `
					<div class="input-group px-2">
                        <input class="form-control bg-inverse bg-opacity-10" id="inputCodigoBarras${counter}" style="text-align: center;" disabled>
                    </div>
				`;

				var input07 = `
					<div class="input-group px-2">
                        <input class="form-control" name="inputCantidad${counter}" id="inputCantidad${counter}" style="text-align: center;">
                    </div>
				`;

				var input08 = `
					<div class="input-group">
                        <input class="form-control bg-inverse bg-opacity-10" name="inputPrecio${counter}" id="inputPrecio${counter}" style="text-align: center;" disabled>
                    </div>
				`;

				var input09 = `
					<div class="input-group px-5">
                        <input class="form-control" name="inputPorcentajeDescuento${counter}" id="inputPorcentajeDescuento${counter}" style="text-align: center;">
                    </div>
				`;

				var input10 = `
					<div class="input-group">
                        <input class="form-control bg-inverse bg-opacity-10" placeholder="18" name="inputIGV${counter}" id="inputIGV${counter}" style="text-align: center;" disabled>
                    </div>
				`;

				const fila = [opciones, input01, input02, input03, input04, input05, input06, input07, input08, input09, input10];

				var newRow = table.row.add(fila).draw(false).node();
				$(newRow).find('.eliminarFila').attr('data-row-index', counter);


				$.typeahead({
					input: `#inputCodigoArticulo${counter}`,
					order: "desc",
					source: {
						data: articulos_codigo
					},
					minLength: 3
				});

				$.typeahead({
					input: `#inputDescripcionArticulo${counter}`,
					order: "desc",
					source: {
						data: articulos_descripcion
					},
					minLength: 3
				});

				

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

			//botonAgregar.click();


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

				getProductById(codigoArticulo)
					.then(function (dataArticulo) {

						$(`#inputDescripcionArticulo${index}`).val(dataArticulo.DescripcionArticulo);
						$(`#inputCodigoBarras${index}`).val(dataArticulo.CodigoBarra);

						getStoragesByProduct(codigoArticulo)
							.then(function (dataAlmacenes) {

								$.typeahead({
									input: `#inputCodigoAlmacen${index}`,
									order: "desc",
									source: {
										data: dataAlmacenes
									},
									minLength: 3
								});

							})
							.catch(function (error) {
								console.log(error);
							});
					})
					.catch(function (error) {
						console.log(error);
					});

			});

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
					resolve(dataArticulos);
				},
				error: function (xhr, status, error) {
					reject(error);
				}
			});
		});
	}

	function getProductList() {
		return new Promise(function (resolve, reject) {
			var url = "/api/product/getProductList";

			$.ajax({
				url: url,
				type: "GET",
				success: function (response) {
					var articulos = JSON.parse(response);
					resolve(articulos);
				},
				error: function (xhr, status, error) {
					reject(error);
				}
			});
		});
	}

	function getStoragesByProduct(productCode) {
		return new Promise(function (resolve, reject) {
			var url = "/api/product/getStoragesByProduct";
			var parameters = {
				productCode: productCode
			};

			$.ajax({
				url: url,
				type: "GET",
				data: parameters,
				success: function (response) {
					var almacenes = JSON.parse(response);
					resolve(almacenes);
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
	
	
	$("#formNewOrderDraft").on("submit", function (e) {

		e.preventDefault();
		
		var codigo = $('#inputCodigoCliente').val();
		var personaContacto = $('#inputPersonaContacto').val();
		var numeroReferencia = $('#inputNumeroReferencia').val();
		var direccionDestino = $('#inputDireccionDestino').val();
		var destinatarioFactura = $('#inputDestinatarioFactura').val();
		var moneda = $('#inputMoneda').val();
		var serie = $('#inputSerieDoc').val();

		var fechaFormateada = $('#datepicker-default').val();
		var fechaContabilizacion = formatearFecha(fechaFormateada, 'YYYY-MM-DD');

		var fechaFormateada2 = $('#datepicker-range').val();
		var fechaEntrega = formatearFecha(fechaFormateada2, 'YYYY-MM-DD');

		var fechaFormateada3 = $('#datepicker-inline').val();
		var fechaDocumento = formatearFecha(fechaFormateada3, 'YYYY-MM-DD');

		var condicionPago = $('#inputCondicionPago').val();
		var comentario = $('#textAreaComentario').val();

		var nuevaOrdenPreliminar = new OrdenPreliminar(codigo, personaContacto, numeroReferencia, direccionDestino, destinatarioFactura, moneda, fechaContabilizacion, fechaEntrega, fechaDocumento, condicionPago, comentario, serie);

		$('#detalleRow tr').each(function () {
			var CodigoArticulo = $(this).find('[name^="inputCodigoArticulo"]').val();
			var CodigoAlmacen = $(this).find('[name^="inputCodigoAlmacen"]').val();
			var Precio = $(this).find('[name^="inputPrecio"]').val();
			var Cantidad = $(this).find('[name^="inputCantidad"]').val();
			var PorcentajeDescuento = $(this).find('[name^="inputPorcentajeDescuento"]').val();
			var VatGroup = $(this).find('[name^="inputIGV"]').val();

			nuevaOrdenPreliminar.addDocumentLine(CodigoArticulo, CodigoAlmacen, Precio, Cantidad, PorcentajeDescuento, VatGroup);
		});

		//console.log(nuevaOrdenPreliminar);

		var dataDraft = JSON.stringify(nuevaOrdenPreliminar);

		//console.log(dataDraft);

		var DRAFT = {
			CardCode: nuevaOrdenPreliminar.CardCode,
			ContactPersonCode: nuevaOrdenPreliminar.ContactPersonCode,
			NumAtCard: nuevaOrdenPreliminar.NumAtCard,
			ShipToCode: nuevaOrdenPreliminar.ShipToCode,
			PayToCode: nuevaOrdenPreliminar.PayToCode,
			DocCurrency: nuevaOrdenPreliminar.DocCurrency,
			DocObjectCode: 17,
			DocDate: nuevaOrdenPreliminar.DocDate,
			DocDueDate: nuevaOrdenPreliminar.DocDueDate,
			TaxDate: nuevaOrdenPreliminar.TaxDate,
			GroupNum: nuevaOrdenPreliminar.GroupNum,
			Comments: nuevaOrdenPreliminar.Comments,
			Series: nuevaOrdenPreliminar.Series,
			DocumentLines:
				[
					{
						ItemCode: nuevaOrdenPreliminar.DocumentLines[0].ItemCode,
						WarehouseCode: nuevaOrdenPreliminar.DocumentLines[0].WarehouseCode,
						UnitPrice: nuevaOrdenPreliminar.DocumentLines[0].UnitPrice,
						Quantity: nuevaOrdenPreliminar.DocumentLines[0].Quantity,
						DiscountPercent: nuevaOrdenPreliminar.DocumentLines[0].DiscountPercent,
						VatGroup: nuevaOrdenPreliminar.DocumentLines[0].VatGroup
					}
				]
		};

		//console.log(DRAFT);
		
		$.ajax({
			url: "/api/PreOrders",
			method: "POST",
			contentType: "application/json",
			data: JSON.stringify(DRAFT),
			success: function (response) {
				$("#alertaConfirmacion").show();
				$("#alertaConfirmacion").removeClass("alert-danger").addClass("alert-success");
				$("#alertaConfirmacion").text("La orden de venta preliminar fue creada correctamente.").fadeIn();
				ocultarMensaje();
			},
			error: function (xhr, status, error) {
				$("#alertaConfirmacion").show();
				$("#alertaConfirmacion").removeClass("alert-success").addClass("alert-danger");
				$("#alertaConfirmacion").text("Se produjo un error en la solicitud.").fadeIn();
				ocultarMensaje();
			}
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