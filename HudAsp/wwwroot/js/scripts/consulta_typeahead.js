
var handleRenderTimepicker = function () {
	$('#timepicker-inicio').timepicker();

	$('#timepicker-final').timepicker();

	$('#timepicker-default').timepicker({
		showMeridian: false,
		minuteStep: 1
	});

};

var handleRenderTableData = function () {

	function filterColumn(i) {
		$('#datatableOrderDraft')
			.DataTable()
			.column(i)
			.search(
				$('#col' + i + '_filter').val(),
			)
			.draw();
	}

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
		//columns: [
		//	{ data: "Nro Orden" },
		//	{ data: "Código de Cliente" },
		//	{ data: "Nombre de Cliente" },
		//	{ data: "Fecha" },
		//	{ data: "Monto" },
		//	{ data: "Estado" },
		//	{ data: "Status" },
		//	{ data: "Usuario" },
		//	{ data: "Vendedor" },
		//	{ data: null, defaultContent: btnHTML }
		//],
		createdRow: function (row, data, index) {
			$('td', row).addClass('align-middle');
			$('td', row).addClass('px-2');
			//$('td:eq(2)', row).addClass('text-wrap');
			//$('td:eq(8)', row).addClass('text-wrap');
			$('td', row).addClass('text-sm');

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
	$.typeahead({
		input: '#typeahead',
		order: "desc",
		source: {
			data: [
				"Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
				"Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh",
				"Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia",
				"Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burma",
				"Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad",
				"Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic", "Congo, Republic of the",
				"Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti",
				"Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador",
				"Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon",
				"Gambia", "Georgia", "Germany", "Ghana", "Greece", "Greenland", "Grenada", "Guatemala", "Guinea",
				"Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India",
				"Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan",
				"Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kuwait", "Kyrgyzstan", "Laos",
				"Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
				"Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands",
				"Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Mongolia", "Morocco", "Monaco",
				"Mozambique", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger",
				"Nigeria", "Norway", "Oman", "Pakistan", "Panama", "Papua New Guinea", "Paraguay", "Peru",
				"Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Samoa", "San Marino",
				"Sao Tome", "Saudi Arabia", "Senegal", "Serbia and Montenegro", "Seychelles", "Sierra Leone",
				"Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "Spain",
				"Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan",
				"Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
				"Turkmenistan", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
				"Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
			]
		}
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