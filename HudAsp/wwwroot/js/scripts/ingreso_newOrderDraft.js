﻿

var handleToastToggle = function () {

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
			console.log(error);
		});

	function getCustomerAddressByType(addressType, customerId) {
		return new Promise(function (resolve, reject) {
			var url = "/api/Customer/getCustomerAddressByType";
			var parameters = {
				addressType: addressType,
				customerId: customerId
			};

			$.ajax({
				url: url,
				type: "GET",
				data: parameters,
				success: function (response) {
					var dataDirecciones = JSON.parse(response);
					resolve(dataDirecciones);
				},
				error: function (xhr, status, error) {
					reject(error);
				}
			});
		});
	}


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

		$('#inputCodigoCliente').removeAttr('data-codPriceList');

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
		destinatarioFactura.empty();
		$('#textAreaDestinatarioFactura').val('');
	}

	function autocompletarCabecera(codigoCliente, tipo) {

		getCustomerById(codigoCliente)
			.then(function (dataCliente) {

				/*BEGIN Autocompletar */
				$('#inputCodigoCliente').attr('data-codPriceList', dataCliente.Cod_Lista_Precio);

				if (tipo == "C") {
					$('#inputNombreCliente').val(dataCliente.Nombre_Cliente);
				} else if(tipo == "N"){
					$('#inputCodigoCliente').val(dataCliente.Codigo_Cliente);
				}

				var personaContacto = $('#inputPersonaContacto');
				personaContacto.empty();
				personaContacto.append(`<option value="${dataCliente.contactoCodigo}" selected>${dataCliente.contactoNombre}</option>`);

				$('#inputCondicionPago').val(dataCliente.Condicion_pago);
				$('#inputMoneda').val(dataCliente.Moneda);
				$('#inputNumeroReferencia').val(dataCliente.Numero_Referencia);

				var direccionDestino = $('#inputDireccionDestino');
				direccionDestino.empty();
				direccionDestino.append(`<option value="${dataCliente.direccionDestinoCodigo}" selected>${dataCliente.direccionDestinoCodigo}</option>`);
				$('#textAreaDireccionDestino').val(dataCliente.Direccion_Destino);

				var destinatarioFactura = $('#inputDestinatarioFactura');
				destinatarioFactura.empty();
				destinatarioFactura.append(`<option value="${dataCliente.direccionFacturaCodigo}" selected>${dataCliente.direccionFacturaCodigo}</option>`);
				$('#textAreaDestinatarioFactura').val(dataCliente.Direccion_Factura);

				/*END Autocompletar */

				getPersonContactsByCustomerId(codigoCliente)
					.then(function (dataContacto) {
						dataContacto.forEach(function (contacto) {
							if (contacto.codigo !== dataCliente.contactoCodigo) {
								personaContacto.append(`<option value="${contacto.codigo}" selected>${contacto.nombreCompleto}</option>`);
							}
						});
					})
					.catch(function (error) {
						console.log(error);
					});

				//GET Direcciones Destino (B)
				getCustomerAddressByType('S', codigoCliente)
					.then(function (dataDirecciones) {
						dataDirecciones.forEach(function (destino) {
							if (dataCliente.direccionDestinoCodigo !== destino.codigo) {
								direccionDestino.append(`<option value="${destino.codigo}">${destino.codigo}</option>`);
							}
						});
						manejarDDestino(dataDirecciones);
					})
					.catch(function (error) {
						console.log(error);
					});
				//GET Direcciones Factura (S)
				getCustomerAddressByType('B', codigoCliente)
					.then(function (dataDirecciones) {
						//console.log(dataDirecciones);
						dataDirecciones.forEach(function (factura) {
							if (dataCliente.direccionFacturaCodigo !== factura.codigo) {
								destinatarioFactura.append(`<option value="${factura.codigo}">${factura.codigo}</option>`);
							}
						});
						manejarDFactura(dataDirecciones);
					})
					.catch(function (error) {
						console.log(error);
					});
			})
			.catch(function (error) {
				console.log(error);
			});
	}

	$("#inputCodigoCliente").on("input", function () {
		if ($(this).val() === "") {
			vaciarCabecera();
		}
	});

	$('#porCodigoCliente').on('click', function () {

		vaciarCabecera();

		var codigoCliente = $('#inputCodigoCliente').val();

		if (codigoCliente.length > 0) {
			autocompletarCabecera(codigoCliente);
		}
	});

	$("#inputCodigoCliente").on("blur", function () {

		var codigoCliente = $(this).val();
		//vaciarCabecera();

		if (codigoCliente.length > 0) {
			autocompletarCabecera(codigoCliente, 'C');
		} 

	});

	function manejarDDestino(data) {
		$("#inputDireccionDestino").change(function () {
			var direccionDestino = $(this).val();
			var descripcionDestino = $("#textAreaDireccionDestino");

			data.forEach(function (destino) {
				if (direccionDestino == destino.codigo) {
					descripcionDestino.val(destino.descripcion);
				}
			});
		})
	}

	function manejarDFactura(data) {
		$("#inputDestinatarioFactura").change(function () {
			var direccionFactura = $(this).val();
			var descripcionFactura = $("#textAreaDireccionDestino");

			data.forEach(function (factura) {
				if (direccionFactura == factura.codigo) {
					descripcionFactura.val(factura.descripcion);
				}
			});
		})
	}

	/*BEGIN porNombreCliente */

	$('#porNombreCliente').on('click', function () {

		vaciarCabecera();
		
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

				if (codigoClienteEncontrado !== null) {

					autocompletarCabecera(codigoClienteEncontrado, 'N');

				} else {
					console.log('Cliente no encontrado');
				}

			})
			.catch(function (error) {
				console.log(error);
			});
	});

	$("#inputNombreCliente").on("blur", function () {
		//vaciarCabecera();

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

				if (codigoClienteEncontrado !== null) {

					autocompletarCabecera(codigoClienteEncontrado, 'N');

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

	function getTransferenciaGratuita() {
		return new Promise(function (resolve, reject) {

			var url = "/api/PreOrders/getTransferenciaGratuita";

			$.ajax({
				url: url,
				type: "GET",
				success: function (response) {
					var TransGrat = JSON.parse(response);

					resolve(TransGrat);
				},
				error: function (xhr, status, error) {
					reject(error);
				}
			});

		})
	}

	getTransferenciaGratuita()
		.then(function (dataTransGrat) {
			var selectElement = $('#inputTransferenciaGratuita');

			selectElement.empty();
			selectElement.append('<option value=""></option>');


			dataTransGrat.forEach(function (transGrat) {
				var option = $('<option></option>');

				option.val(transGrat.id);
				option.text(transGrat.descripcion);

				selectElement.append(option);
			});
		})
		.catch(function (error) {
			console.log(error);
		});


	function getConsignacion() {
		return new Promise(function (resolve, reject) {

			var url = "/api/PreOrders/getConsignacion";

			$.ajax({
				url: url,
				type: "GET",
				success: function (response) {
					var consignacion = JSON.parse(response);

					resolve(consignacion);
				},
				error: function (xhr, status, error) {
					reject(error);
				}
			});

		})
	}


	getConsignacion()
		.then(function (dataConsignacion) {
			var selectElement = $('#inputConsignacion');

			selectElement.empty();
			selectElement.append('<option value=""></option>');

			dataConsignacion.forEach(function (consignacion) {
				var option = $('<option></option>');

				option.val(consignacion.id);
				option.text(consignacion.descripcion);

				selectElement.append(option);
			});
		})
		.catch(function (error) {
			console.log(error);
		});

	function manejoSeries(data) {
		$("#inputSerieDoc").change(function () {
			var Serie = $(this).val();
			var Correlativo = $("#inputCorrelativo");

			data.forEach(function (serie) {
				if (Serie == serie.CodSerie) {
					Correlativo.val(serie.Correlativo);
				}
			});
		})
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
						manejoSeries(serie)
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

};

var handleRenderTableData = function () {

	function llenarDetalle(orderData, articulos_codigo, articulos_descripcion) {
		orderData.forEach(function (item) {
			var counter = table.rows().count();

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
					<div class="typeahead__query input-group">
					  <span data-index="${counter}" class="input-group-text porCodigoArticulo"><i class="fa-solid fa-magnifying-glass"></i></span>
					  <input data-index="${counter}" type="text" value="${item.CodArticulo}" class="form-control codigoArticulo" name="inputCodigoArticulo${counter}" id="inputCodigoArticulo${counter}" data-column="${counter}" autocomplete="off"
					  style="width: 100px;" required>
					</div>
				  </div>
				</div>
			  `;

			var input02 = `
				<div class="typeahead__container">
				  <div class="typeahead__field">
					<div class="typeahead__query input-group">
					  <span data-index="${counter}" class="input-group-text porDescripcionArticulo"><i class="fa-solid fa-magnifying-glass"></i></span>
					  <input data-index="${counter}" type="text" value="${item.Descripcion}" class="form-control descripcionArticulo" name="inputDescripcionArticulo${counter}" id="inputDescripcionArticulo${counter}" data-column="${counter}" autocomplete="off"
					  style="font-size: 12px; width: 750px;" required>
					</div>
				  </div>
				</div>
			  `;

			var input03 = `
				<div class="typeahead__container">
				  <div class="typeahead__field">
					<div class="typeahead__query input-group">
					  <span data-index="${counter}" class="input-group-text porCodigoAlmacen"><i class="fa-solid fa-magnifying-glass"></i></span>
					  <input data-index="${counter}" type="text" value="${item.Almacen}" class="form-control codigoAlmacen" name="inputCodigoAlmacen${counter}" id="inputCodigoAlmacen${counter}" data-column="${counter}" autocomplete="off"
					  style="width: 110px;" required>
					</div>
				  </div>
				</div>
			  `;

			var input04 = `
				<div class="input-group">
				  <input value="${item.CantidadAlmacen}" class="form-control bg-inverse bg-opacity-10 custom-table-form" id="inputCantidadAlmacen${counter}" autocomplete="off" disabled>
				</div>
			  `;

			var input05 = `
				<div class="input-group">
				  <input value="${item.StockGeneral}" class="form-control bg-inverse bg-opacity-10 custom-table-form" id="inputStockAlmacen${counter}" autocomplete="off" disabled>
				</div>
			  `;

			var input06 = `
				<div class="input-group">
				  <input value="${item.CodigodeBarra}" class="form-control bg-inverse bg-opacity-10 custom-table-form" id="inputCodigoBarras${counter}" autocomplete="off" disabled>
				</div>
			  `;

			var input07 = `
				<div class="input-group">
				  <input onkeypress="return (event.charCode == 46 || event.charCode >= 48 && event.charCode <= 57)" value="${item.Cantidad}" class="form-control custom-table-form" name="inputCantidad${counter}" id="inputCantidad${counter}" autocomplete="off" required>
				</div>
			  `;

			var input08 = `
				<div class="input-group">
				  <input value="${item.PrecioUnitario}" class="form-control bg-inverse bg-opacity-10 custom-table-form" name="inputPrecio${counter}" id="inputPrecio${counter}" autocomplete="off" disabled>
				</div>
			  `;

			var input09 = `
				<div class="input-group">
				  <span class="input-group-text">%</span>
				  <input type="number" min="0" max="100" onkeypress="return (event.charCode == 46 || event.charCode >= 48 && event.charCode <= 57)" value="${item.Descuento}" class="form-control custom-table-form" name="inputPorcentajeDescuento${counter}" id="inputPorcentajeDescuento${counter}" autocomplete="off">
				</div>
			  `;

			var input10 = `
				<div class="input-group">
				  <input data-valor="${item.ValorImpuesto}" value="${item.IndicadorImpuesto}" class="form-control bg-inverse bg-opacity-10 custom-table-form" name="inputIGV${counter}" id="inputIGV${counter}"  autocomplete="off" disabled>
				</div>
			  `;

			var fila = [
				opciones,
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
				fila.push("");
			}

			table.row.add(fila).draw(false);

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

			var arregloAlmacenes = [];

			getStoragesByProduct(item.CodArticulo)
				.then(function (dataAlmacenes) {

					dataAlmacenes.forEach(function (almacen) {
						arregloAlmacenes.push(almacen.storageId);
					});

					$.typeahead({
						input: `#inputCodigoAlmacen${counter}`,
						order: "desc",
						source: {
							data: arregloAlmacenes
						},
						minLength: 3
					});

				})
				.catch(function (error) {
					console.log(error);
				});

		});

	}

	$('#exportCSV').on('click', function () {

		var csvData = Array.from(document.querySelectorAll('#cabecera th'))
			.map(th => th.textContent.trim())
			.map(header => removeAccents(header))
			.filter(header => header !== "")
			.join(';') + '\n';

		var rows = document.querySelectorAll('#detalleRow tr');
		rows.forEach(row => {
			var rowData = Array.from(row.querySelectorAll('input'))
				/*.map(input => input.getAttribute('value'))*/
				.map(input => input.value)
				.map(cell => (cell || '').replace(/\r\r/g, ' ').replace(/\r/g, ' '))
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

	function removeAccents(text) {
		return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
	}

	var btnHTML = `
		<label class="ms-auto">
			<button type="button" id="agregarFilaProducto" class="btn btn-outline-theme">
				<i class="fa fa-plus-circle fa-fw me-1"></i>
				<span class="text-dark">Agregar producto</span>
			</button>
		</label>
	`;

	var inputCantidadHTML = `
		<div>
			<input class="form-control" placeholder="Nro de líneas" type="number" min="0" max="100" maxlength="3"
			onkeypress="return (event.charCode == 46 || event.charCode >= 48 && event.charCode <= 57)">
		</div>
	`;

	var domHTML = `
		<'row mb-3 px-3 pt-2 gx-3'
			<'col-5 p-0'
				l
			>
			<'#pBuscar.col-4 ms-auto px-3'
				
			>
			<'.col-3 ms-auto p-0'
				<'.row'
					<'#pBoton.col-6 d-flex'
						
					>
					<'#pInputCantidad.col-6'
						
					>
				>
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
		constructor(CardCode, ContactPersonCode, NumAtCard, ShipToCode, PayToCode, DocCurrency, DocDate
			, DocDueDate, TaxDate, GroupNum, Comments, Series, U_HMK_TRANS, U_DGP_DropConsignment
			, U_DGP_NumAtCardSup, U_DGP_OwnerCode) {

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
			this.U_HMK_TRANS = U_HMK_TRANS;
			this.U_DGP_DropConsignment = U_DGP_DropConsignment;
			this.U_DGP_NumAtCardSup = U_DGP_NumAtCardSup;
			this.U_DGP_OwnerCode = U_DGP_OwnerCode;
			this.DocumentLines = [];
		}

		addDocumentLine(ItemCode, WarehouseCode, UnitPrice, Quantity, DiscountPercent, VatGroup) {
			const documentLine = new DocumentLine(ItemCode, WarehouseCode, UnitPrice, Quantity, DiscountPercent, VatGroup);
			this.DocumentLines.push(documentLine);
		}
	}

	var orderData = $('#orderData').data('order');
	if (orderData != '') {
		console.log(orderData);
	}

	var filaEliminada = [];

	var table = $('#datatableNewOrderDraft').DataTable({
		pageLength: 100,
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
			//$('#pInputCantidad').append(inputCantidadHTML);

			var articulos_codigo = [];
			var articulos_descripcion = [];

			getProductList()
				.then(function (articulos) {
					articulos.forEach(function (articulo) {
						articulos_codigo.push(articulo.CodigoArticulo);
						articulos_descripcion.push(articulo.DescripcionArticulo);

					});

					if (orderData != '') {
						llenarDetalle(orderData, articulos_codigo, articulos_descripcion);
					}
					
					botonAgregar.click();
				})
				.catch(function (error) {
					console.log(error);
				});

			var botonAgregar = $('#agregarFilaProducto').on('click', function () {

				var counter = table.rows().count(); 

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
							<div class="typeahead__query input-group">
								<span data-index="${counter}" class="input-group-text porCodigoArticulo"><i class="fa-solid fa-magnifying-glass"></i></span>
								<input data-index="${counter}" type="text" class="form-control codigoArticulo" name="inputCodigoArticulo${counter}" id="inputCodigoArticulo${counter}" data-column="${counter}" autocomplete="off"
								style="width: 100px;">
							</div>
						</div>
					</div>
				`;

				var input02 = `
					<div class="typeahead__container">
						<div class="typeahead__field">
							<div class="typeahead__query input-group">
								<span data-index="${counter}" class="input-group-text porDescripcionArticulo"><i class="fa-solid fa-magnifying-glass"></i></span>
								<input data-index="${counter}" type="text" class="form-control descripcionArticulo" name="inputDescripcionArticulo${counter}" id="inputDescripcionArticulo${counter}" data-column="${counter}" autocomplete="off"
								style="font-size: 12px; width: 750px;">
							</div>
						</div>
					</div>
				`;

				var input03 = `
					<div class="typeahead__container">
						<div class="typeahead__field">
							<div class="typeahead__query input-group">
								<span data-index="${counter}" class="input-group-text porCodigoAlmacen"><i class="fa-solid fa-magnifying-glass"></i></span>
								<input data-index="${counter}" type="text" class="form-control codigoAlmacen" name="inputCodigoAlmacen${counter}" id="inputCodigoAlmacen${counter}" data-column="${counter}" autocomplete="off"
								style="width: 110px;">
							</div>
						</div>
					</div>
				`;


				var input04 = `
					<div class="input-group">
                        <input class="form-control bg-inverse bg-opacity-10 custom-table-form" id="inputCantidadAlmacen${counter}" autocomplete="off" disabled>
                    </div>
				`;

				var input05 = `
					<div class="input-group">
                        <input class="form-control bg-inverse bg-opacity-10 custom-table-form" id="inputStockAlmacen${counter}" autocomplete="off" disabled>
                    </div>
				`;

				var input06 = `
					<div class="input-group">
                        <input class="form-control bg-inverse bg-opacity-10 custom-table-form" id="inputCodigoBarras${counter}" autocomplete="off" disabled>
                    </div>
				`;

				var input07 = `
					<div class="input-group">
                        <input onkeypress="return (event.charCode == 46 || event.charCode >= 48 && event.charCode <= 57)" class="form-control custom-table-form" name="inputCantidad${counter}" id="inputCantidad${counter}" autocomplete="off">
                    </div>
				`;

				var input08 = `
					<div class="input-group">
                        <input class="form-control bg-inverse bg-opacity-10 custom-table-form" name="inputPrecio${counter}" id="inputPrecio${counter}" autocomplete="off" disabled>
                    </div>
				`;

				var input09 = `
					<div class="input-group">
						<span class="input-group-text">%</span>
                        <input type="number" min="0" max="100" maxlength="3" onkeypress="return (event.charCode == 46 || event.charCode >= 48 && event.charCode <= 57)" class="form-control custom-table-form" name="inputPorcentajeDescuento${counter}" id="inputPorcentajeDescuento${counter}" autocomplete="off">
                    </div>
				`;

				var input10 = `
					<div class="input-group">
                        <input class="form-control bg-inverse bg-opacity-10 custom-table-form" name="inputIGV${counter}" id="inputIGV${counter}" autocomplete="off" disabled>
                    </div>
				`;

				const fila = [opciones, input01, input02, input07, input09, input03, input04, input05, input08, input10, input06];

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
				calcularTotales() 
			});

			$(document).on('click', '.duplicarFila', function () {

				var counterA = table.rows().count(); 
				var counter = counterA + 1;

				var filaActual = $(this).closest('tr');
				var nuevaFila = filaActual.clone();

				var nuevaID = 'fila' + counter;

				nuevaFila.attr('id', nuevaID);
				nuevaFila.find('[id^=inputCodigoArticulo]').attr('id', 'inputCodigoArticulo' + counter);
				nuevaFila.find('[id^=inputDescripcionArticulo]').attr('id', 'inputDescripcionArticulo' + counter);

				table.row.add(nuevaFila).draw(false);

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




				calcularTotales();

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

			/* POR CODIGO ALMACEN */
			$(document).on('click', '.porCodigoAlmacen', function () {

				var index = $(this).data('index');

				var codListaPrecio = $('#inputCodigoCliente').attr('data-codPriceList');

				var codigoArticulo = $(`#inputCodigoArticulo${index}`).val();
				$(`#inputCodigoArticulo${index}`).attr('required', true);

				var codigoAlmacen = $(`#inputCodigoAlmacen${index}`).val();
				$(`#inputCodigoAlmacen${index}`).attr('required', true);

				getLineArt(codListaPrecio, codigoArticulo, codigoAlmacen).
					then(function (linea) {
						$(`#inputIGV${index}`).val(linea.Impuesto);
						$(`#inputIGV${index}`).attr("data-valor", linea.VarlorImpuesto);

						$(`#inputCantidadAlmacen${index}`).val(linea.Stock);
						$(`#inputStockAlmacen${index}`).val(linea.StockGeneral);
						var inputValue1 = $(`#inputCantidad${index}`).val();
						$(`#inputCantidad${index}`).attr('required', true);

						if (inputValue1 === '') {
							$(`#inputCantidad${index}`).val(1);
						}

						var inputValue2 = $(`#inputPorcentajeDescuento${index}`).val();
						$(`#inputPorcentajeDescuento${index}`).attr('required', true);

						if (inputValue2 === '') {
							$(`#inputPorcentajeDescuento${index}`).val(0.0);
						}

						getPorcentajeDescuento(codigoArticulo, codigoAlmacen)
							.then(function (descuento) {
								$(`#inputPorcentajeDescuento${index}`).val(descuento);
								calcularTotales();
							})
							.catch(function (error) {

							})
					})
					.catch(function (error) {
						console.log(error);
					});
			});

			$(document).on('blur', '.codigoAlmacen', function () {

				var index = $(this).data('index');

				var codListaPrecio = $('#inputCodigoCliente').attr('data-codPriceList');

				var codigoArticulo = $(`#inputCodigoArticulo${index}`).val();
				$(`#inputCodigoArticulo${index}`).attr('required', true);

				var codigoAlmacen = $(`#inputCodigoAlmacen${index}`).val();
				$(`#inputCodigoAlmacen${index}`).attr('required', true);

				getLineArt(codListaPrecio, codigoArticulo, codigoAlmacen).
					then(function (linea) {
						$(`#inputIGV${index}`).val(linea.Impuesto);
						$(`#inputIGV${index}`).attr("data-valor", linea.VarlorImpuesto);

						$(`#inputCantidadAlmacen${index}`).val(linea.Stock);
						$(`#inputStockAlmacen${index}`).val(linea.StockGeneral);
						var inputValue1 = $(`#inputCantidad${index}`).val();
						$(`#inputCantidad${index}`).attr('required', true);

						if (inputValue1 === '') {
							$(`#inputCantidad${index}`).val(1);
						}

						var inputValue2 = $(`#inputPorcentajeDescuento${index}`).val();
						$(`#inputPorcentajeDescuento${index}`).attr('required', true);

						if (inputValue2 === '') {
							$(`#inputPorcentajeDescuento${index}`).val(0.0);
						}

						getPorcentajeDescuento(codigoArticulo, codigoAlmacen)
							.then(function (descuento) {
								$(`#inputPorcentajeDescuento${index}`).val(descuento);
								calcularTotales();
							})
							.catch(function (error) {

							})
					})
					.catch(function (error) {
						console.log(error);
					});
			});


			/* POR DESCRIPCION ALMACEN */
			$(document).on('click', '.porDescripcionArticulo', function () {
				var index = $(this).data('index');

				var descripcionArticulo = $(`#inputDescripcionArticulo${index}`).val();

				getProductList()
					.then(function (articulos) {

						var codigoArticulo;
						articulos.forEach(function (articulo) {
							if (articulo.DescripcionArticulo === descripcionArticulo) {
								codigoArticulo = articulo.CodigoArticulo;
								return;
							}
						});

						$(`#inputCodigoArticulo${index}`).val(codigoArticulo);

						var codListaPrecio = $('#inputCodigoCliente').attr('data-codPriceList');

						autocompletarDetalle(codigoArticulo, codListaPrecio, index);

						var inputCodigoArticulo = $(`#inputCodigoArticulo${index + 1}`);
						if (!inputCodigoArticulo.length && $(`#inputCodigoArticulo${index}`).val() != '') {
							botonAgregar.click();
							$.typeahead({
								input: `#inputCodigoArticulo${index + 1}`,
								order: "desc",
								source: {
									data: articulos_codigo
								},
								minLength: 3
							});

							$.typeahead({
								input: `#inputDescripcionArticulo${index + 1}`,
								order: "desc",
								source: {
									data: articulos_descripcion
								},
								minLength: 3
							});
						}


					})
					.catch(function (error) {
						console.log(error)
					})

				var inputCodigoArticulo = $(`#inputCodigoArticulo${index + 1}`);
				if (!inputCodigoArticulo.length && codigoArticulo != '') {
					botonAgregar.click();
					$.typeahead({
						input: `#inputCodigoArticulo${index + 1}`,
						order: "desc",
						source: {
							data: articulos_codigo
						},
						minLength: 3
					});

					$.typeahead({
						input: `#inputDescripcionArticulo${index + 1}`,
						order: "desc",
						source: {
							data: articulos_descripcion
						},
						minLength: 3
					});
				}
				calcularTotales();
			});

			$(document).on('blur', '.descripcionArticulo', function () {
				var index = $(this).data('index');

				var descripcionArticulo = $(`#inputDescripcionArticulo${index}`).val();

				getProductList()
					.then(function (articulos) {

						var codigoArticulo;
						articulos.forEach(function (articulo) {
							if (articulo.DescripcionArticulo === descripcionArticulo) {
								codigoArticulo = articulo.CodigoArticulo;
								return;
							}
						});

						$(`#inputCodigoArticulo${index}`).val(codigoArticulo);

						var codListaPrecio = $('#inputCodigoCliente').attr('data-codPriceList');

						autocompletarDetalle(codigoArticulo, codListaPrecio, index);
						calcularTotales();
						var inputCodigoArticulo = $(`#inputCodigoArticulo${index + 1}`);
						if (!inputCodigoArticulo.length && $(`#inputCodigoArticulo${index}`).val() != '') {
							botonAgregar.click();
							$.typeahead({
								input: `#inputCodigoArticulo${index + 1}`,
								order: "desc",
								source: {
									data: articulos_codigo
								},
								minLength: 3
							});

							$.typeahead({
								input: `#inputDescripcionArticulo${index + 1}`,
								order: "desc",
								source: {
									data: articulos_descripcion
								},
								minLength: 3
							});
						}

					})
					.catch(function (error) {
						console.log(error)
					})
				
			});


			function ejecutarCodigoArticulo(index) {

				limpiarLineaArticulo(index);

				var codListaPrecio = $('#inputCodigoCliente').attr('data-codPriceList');

				var codigoArticulo = $(`#inputCodigoArticulo${index}`).val();

				autocompletarDetalle(codigoArticulo, codListaPrecio, index);

				var filas = table.rows().count();

				for (var i = index; i <= filas; i++) {
					var inputCodigoArticulo = $(`#inputCodigoArticulo${index + 1}`);
					if (!inputCodigoArticulo.length && codigoArticulo !== '') {
						botonAgregar.click();
						$.typeahead({
							input: `#inputCodigoArticulo${index + 1}`,
							order: "desc",
							source: {
								data: articulos_codigo
							},
							minLength: 3
						});

						$.typeahead({
							input: `#inputDescripcionArticulo${index + 1}`,
							order: "desc",
							source: {
								data: articulos_descripcion
							},
							minLength: 3
						});
					}
				}
				calcularTotales();
			}





			/* POR CODIGO ARTICULO */
			$(document).on('click', '.porCodigoArticulo', function () {
				var index = $(this).data('index');
				ejecutarCodigoArticulo(index);
				setTimeout(function () {
					calcularTotales();
				}, 1000);
				
			});


			$(document).on('blur', '.codigoArticulo', function () {
				var index = $(this).data('index');
				ejecutarCodigoArticulo(index);
				setTimeout(function () {
					calcularTotales();
				}, 1000);
			});



			/*BEGIN Calcular resumen */

			function calcularTotales() {
				var total = 0;
				var totalImpuestos = 0;

				$('#detalleRow tr').each(function () {
					var cantidad = parseFloat($(this).find('input[name^="inputCantidad"]').val());
					if (isNaN(cantidad)) {
						cantidad = 0;
					}

					var precioUnitario = parseFloat($(this).find('input[name^="inputPrecio"]').val());
					if (isNaN(precioUnitario)) {
						precioUnitario = 0;
					}

					var descuento = parseFloat($(this).find('input[name^="inputPorcentajeDescuento"]').val());
					if (isNaN(descuento)) {
						descuento = 0;
					}

					var igv = parseFloat($(this).find('input[name^="inputIGV"]').attr("data-valor"));
					if (isNaN(igv)) {
						igv = 0;
					}

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


			$(document).on('input blur change', '#detalleRow input[name^="inputCantidad"], #detalleRow input[name^="inputPrecio"], #detalleRow input[name^="inputPorcentajeDescuento"]', function () {
				calcularTotales();
			});

			/*END Calcular resumen*/


			function adaptarDetalle() {

				$('#detalleRow tr').each(function () {
					var CodigoArticulo = $(this).find('[name^="inputCodigoArticulo"]').val();
					var index = $(this).find('[name^="inputCodigoArticulo"]').data('index');
					var CodigoAlmacen = $(this).find('[name^="inputCodigoAlmacen"]').val();
					var Precio = $(this).find('[name^="inputPrecio"]').val();
					var Cantidad = $(this).find('[name^="inputCantidad"]').val();
					var PorcentajeDescuento = $(this).find('[name^="inputPorcentajeDescuento"]').val();
					var VatGroup = $(this).find('[name^="inputIGV"]').val();

					if (CodigoArticulo !== '' && CodigoAlmacen !== '' && Precio !== '' && Cantidad !== '' && PorcentajeDescuento !== '' && VatGroup !== '') {
						if (CodigoArticulo.trim() !== '' && CodigoAlmacen.trim() !== '' && Precio.trim() !== '' && Cantidad.trim() !== '' && PorcentajeDescuento.trim() !== '' && VatGroup.trim() !== '') {
							ejecutarCodigoArticulo(index);
							calcularTotales();
						}
					}
				});

				calcularTotales();
			}


			$('#inputCodigoCliente, #inputNombreCliente').on('blur', function () {
				setTimeout(function () {
					var codListaPrecio = $('#inputCodigoCliente').attr('data-codpricelist');

					if (codListaPrecio && codListaPrecio.trim().length > 0) {
						adaptarDetalle();
					}
				}, 1000);
			});

			setTimeout(function () {
				calcularTotales();
			}, 1000);

		}
	});

	function limpiarLineaArticulo(index) {
		$(`#inputDescripcionArticulo${index}`).val('');
		$(`#inputCodigoBarras${index}`).val('');
		$(`#inputCodigoAlmacen${index}`).val('');
		$(`#inputPrecio${index}`).val('');
		$(`#inputIGV${index}`).val('');
		$(`#inputIGV${index}`).attr("data-valor", '');
		$(`#inputCantidadAlmacen${index}`).val('');
		$(`#inputStockAlmacen${index}`).val('');
		$(`#inputPorcentajeDescuento${index}`).val('');
		$(`#inputCantidad${index}`).val('');
	}

	function getProductById(productCode, productListId) {
		return new Promise(function (resolve, reject) {
			var url = "/api/product/getProductById";
			var parameters = {
				productCode: productCode,
				productListId: productListId
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

	function getLineArt(codListaPrecio, productCode, storageCode) {
		return new Promise(function (resolve, reject) {
			var url = "/api/PreOrders/getLineArt";
			var parameters = {
				codListaPrecio: codListaPrecio,
				productCode: productCode,
				storageCode: storageCode
			};

			$.ajax({
				url: url,
				type: "GET",
				data: parameters,
				success: function (response) {
					var data = JSON.parse(response);
					resolve(data);
				},
				error: function (xhr, status, error) {
					reject(error);
				}
			});
		});
	}

	function getPorcentajeDescuento(productId, storageId) {
		return new Promise(function (resolve, reject) {
			var url = "/api/PreOrders/getPorcentajeDescuento";
			var parameters = {
				productId: productId,
				storageId: storageId
			};

			$.ajax({
				url: url,
				type: "GET",
				data: parameters,
				success: function (response) {
					resolve(response);
				},
				error: function (xhr, status, error) {
					reject(error);
				}
			});
		});
	}

	function autocompletarDetalle(codigoArticulo, codListaPrecio, index) {

		var arregloAlmacenes = [];

		$(`#inputCodigoArticulo${index}`).attr('required', true);
		$(`#inputCodigoAlmacen${index}`).attr('required', true);
		$(`#inputCantidad${index}`).attr('required', true);

		getStoragesByProduct(codigoArticulo)
			.then(function (dataAlmacenes) {

				dataAlmacenes.forEach(function (almacen) {
					arregloAlmacenes.push(almacen.storageId);
				});

				$.typeahead({
					input: `#inputCodigoAlmacen${index}`,
					order: "desc",
					source: {
						data: arregloAlmacenes
					},
					minLength: 3
				});

			})
			.catch(function (error) {
				console.log(error);
			});

		getProductById(codigoArticulo, codListaPrecio)
			.then(function (dataArticulo) {
				$(`#inputDescripcionArticulo${index}`).val(dataArticulo.DescripcionArticulo);
				$(`#inputCodigoBarras${index}`).val(dataArticulo.CodigoBarra);

				$(`#inputCodigoAlmacen${index}`).val(dataArticulo.StorageDefaultId);


				$(`#inputPrecio${index}`).val(dataArticulo.precio);

				var codigoAlmacen = dataArticulo.StorageDefaultId;

				getLineArt(codListaPrecio, codigoArticulo, codigoAlmacen)
					.then(function (linea) {
						$(`#inputIGV${index}`).val(linea.Impuesto);
						$(`#inputIGV${index}`).attr("data-valor", linea.VarlorImpuesto);

						$(`#inputCantidadAlmacen${index}`).val(linea.Stock);
						$(`#inputStockAlmacen${index}`).val(linea.StockGeneral);

						$(`#inputCantidad${index}`).val(1);

						getPorcentajeDescuento(codigoArticulo, codigoAlmacen)
							.then(function (descuento) {
								$(`#inputPorcentajeDescuento${index}`).val(descuento);

								var inputValue2 = $(`#inputPorcentajeDescuento${index}`).val();
								$(`#inputPorcentajeDescuento${index}`).attr('required', true);

								if (inputValue2 === '') {
									$(`#inputPorcentajeDescuento${index}`).val(0.0);
								}

								calcularTotales();
							})
							.catch(function (error) {

							})
					})
					.catch(function (error) {
						console.log(error);
					});

			})
			.catch(function (error) {
				console.log(error);
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

	/*BEGIN post nueva orden preliminar */
	function enviarOrdenPreliminar(nuevaOrdenPreliminar) {
		$('#loadingSpinner').show();

		$.ajax({
			url: "/Ingreso/CreatePreOrder",
			type: "POST",
			dataType: "json",
			data: nuevaOrdenPreliminar
		})
			.done(function (response) {
				$('#loadingSpinner').hide();
				$('#btnAceptar').prop('disabled', false);

				if (JSON.parse(response.value) == 'OK') {
					mostrarToastExitoso("La orden de venta preliminar fue creada correctamente.");
				} else {
					mostrarModal("Error", "<p>Error: " + response.value + "</p>");
					$('#btnAceptar2').show();
				}
			})
			.fail(function (xhr, status, error) {
				$('#loadingSpinner').hide();
				$('#btnAceptar').prop('disabled', false);

				mostrarModal("Error", "<p>Se produjo un error en la solicitud: " + error + "</p>");
				$('#btnAceptar2').show();
			});
	}


	$('#myModal').on('click', '#btnAceptar', function () {
		$('#btnAceptar').prop('disabled', true);
		delete nuevaOrdenPreliminar;

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

		var U_HMK_TRANS = $('#inputTransferenciaGratuita').val();
		var U_DGP_DropConsignment = $('#inputConsignacion').val();
		var U_DGP_NumAtCardSup = $('#inputNumeroOrdenCompra').val();
		var U_DGP_OwnerCode = $("#usuarioAplicacion").data("user");

		var nuevaOrdenPreliminar = new OrdenPreliminar(codigo, personaContacto, numeroReferencia, direccionDestino
			, destinatarioFactura, moneda, fechaContabilizacion, fechaEntrega
			, fechaDocumento, condicionPago, comentario, serie, U_HMK_TRANS
			, U_DGP_DropConsignment, U_DGP_NumAtCardSup, U_DGP_OwnerCode);

		$('#detalleRow tr').each(function () {
			var CodigoArticulo = $(this).find('[name^="inputCodigoArticulo"]').val();
			var CodigoAlmacen = $(this).find('[name^="inputCodigoAlmacen"]').val();
			var Precio = $(this).find('[name^="inputPrecio"]').val();
			var Cantidad = $(this).find('[name^="inputCantidad"]').val();
			var PorcentajeDescuento = $(this).find('[name^="inputPorcentajeDescuento"]').val();

			if (PorcentajeDescuento == '') {
				PorcentajeDescuento = 0;
			} else {
				PorcentajeDescuento = $(this).find('[name^="inputPorcentajeDescuento"]').val();
			}

			var VatGroup = $(this).find('[name^="inputIGV"]').val();

			if (CodigoArticulo !== '' && CodigoAlmacen !== '' && Precio !== '' && Cantidad !== '' && PorcentajeDescuento !== '' && VatGroup !== '') {
				if (CodigoArticulo.trim() !== '' && CodigoAlmacen.trim() !== '' && Precio.trim() !== '' && Cantidad.trim() !== '' && PorcentajeDescuento.trim() !== '' && VatGroup.trim() !== '') {
					nuevaOrdenPreliminar.addDocumentLine(CodigoArticulo, CodigoAlmacen, Precio, Cantidad, PorcentajeDescuento, VatGroup);
				}
			}
		});

		var DRAFT = JSON.stringify(nuevaOrdenPreliminar);
		console.log(DRAFT);

		enviarOrdenPreliminar(nuevaOrdenPreliminar);
	});


	$("#formNewOrderDraft").on("submit", function (e) {
		e.preventDefault();

		$('#myModal').modal('show');
	});

	/*END post nueva orden preliminar */


	$('#btnAceptarError').on('click', function () {
		cerrarModal();
	});

	function mostrarModal(titulo, contenido) {
		$('#myModal').modal('hide');
		$('#modalTitleError').text(titulo);
		$('#modalContentError').html(contenido);
		$('#modalError').modal('show');
	}

	// Función para cerrar el modal
	function cerrarModal() {
		$('#modalError').modal('hide');
	}

	function mostrarToastExitoso(mensaje) {
		$('#myModal').modal('hide');
		var toast = $('#liveToast');
		toast.find('.toast-body').text(mensaje);
		toast.removeClass("alert-danger").addClass("alert-success");
		toast.toast('show');
		setTimeout(function () {
			toast.toast('hide');
			window.location.href = "/Ingreso/OrderDraft";
		}, 4000);
	}

	function mostrarToastError(mensaje) {
		$('#myModal').modal('hide');

		var toast = $('#liveToast');
		toast.find('.toast-body').text(mensaje);
		toast.removeClass("alert-success").addClass("alert-danger");
		toast.toast('show');
		setTimeout(function () {
			toast.toast('hide');
		}, 5000);
	}

};


/* Controller
------------------------------------------------ */
$(document).ready(function () {
	handleRenderTableData();
	handleRenderTypeahead();
	handleToastToggle();
	handleRenderDatepicker();
});