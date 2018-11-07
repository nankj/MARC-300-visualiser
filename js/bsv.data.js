/*
 * bsv.data.js
 * Feature module, slider to set parameters
 */
 
 /* global variables: $, bsv */
 
 
 //**********TODO rename slider > data throughout!

bsv.data = (function() {
	//----------------BEGIN MODULE SCOPE VARIABLES---------------------
	var 
		configMap = {
			main_html : String()
			+	'<div class="bsv-data-close">\<</div>'
			+	'<hr>'
			+	'<div class="bsv-data-params">'
				+	'<fieldset>'	
				+		'<legend>Set parameters</legend>'
//				+		'<form id="data-params-form">'
				+			'<div>'
				+				'<label for="bsv-data-params-ppmm">Pages/mm:</label>'
				+				'<input type="text" id="bsv-data-params-ppmm" value="14"/>'
				+			'</div>'
				+			'<div>'
				+				'<label for="bsv-data-params-marcCol">MARC 300 col:</label>'
				+				'<input type="text" id="bsv-data-params-marcCol" value="2"/>'
				+			'</div>'			
				+			'<div>'
				+				'<label for="bsv-data-params-clothpb">Cloth ratio:</label>'
				+				'<input type="text" id="bsv-data-params-clothpb"/>'
				+			'</div>'
				+			'<div>'
				+				'<label for="bsv-data-params-enter"></label>'
				+				'<button id="bsv-data-params-enter" class="button">Enter</button>'
				+			'</div>'
//				+		'</form>'
				+	'</fieldset>'
			+	'</div>'
			+	'<div>'
			+		'<fieldset class="bsv-data-data">'	
			+			'<legend>Choose data source</legend>'
//			+			'<form>'
			+				'<div>'
			+					'<label for="bsv-data-data-csv">Import CSV file</label><br>'
			+					'<input type="file" name="File upload" id="bsv-data-data-csv" accept=".csv"/>'
			+				'</div>'
			+				'<div>'
			+					'<label for="bsv-data-data-enter">Example data</label>'
			+					'<button id="bsv-data-data-enter" class="button">Use</button>'
			+				'</div>'		
//			+			'</form>'
			+		'</fieldset>'
			+	'</div>',
			dataSlider_extend_time		:	600,
			dataSlider_retract_time		:	600,
			dataSlider_extend_width		:	0,
			dataSlider_retract_width	:	-415,
			dataSlider_out_title		:	'Click to close',
			dataSlider_in_title			:	'Click to change parameters',
			exampleData	:	   [['ID','Width(mm)','Height'],
								["i10111111",23,190],
								["i10111112",26,220],
								["i10111113",12,160],
								["i10111114",28,190],
								["i10111115",36,150],
								["i10111116",35,200],
								["i10111117",32,170],
								["i10111118",11,190],
								["i10111119",41,200],
								["i10111120",10,230],
								["i10111121",43,160],
								["i10111122",20,260],
								["i10111123",32,210],
								["i10111124",30,260],
								["i10111125",28,220],
								["i10111126",30,250],
								["i10111127",40,190],
								["i10111128",21,180],
								["i10111129",24,240],
								["i10111130",24,200],
								["i10111131",23,260],
								["i10111132",39,260],
								["i10111133",11,240],
								["i10111134",33,200],
								["i10111135",18,230],
								["i10111136",24,160],
								["i10111137",18,200],
								["i10111138",31,210],
								["i10111139",14,240],
								["i10111140",17,270],
								["i10111141",38,170],
								["i10111142",27,150],
								["i10111143",11,180],
								["i10111144",42,240],
								["i10111145",22,180],
								["i10111146",27,160],
								["i10111147",11,220],
								["i10111148",31,230],
								["i10111149",38,270],
								["i10111150",38,180],
								["i10111151",12,180],
								["i10111152",17,180],
								["i10111153",25,190],
								["i10111154",10,190],
								["i10111155",40,200]]
		},
		stateMap  = { 
			$container 		: null,
			is_dataSlider_in	: true,
		},
		paramMap  = {},
		bookData  = [],
		jqueryMap =	{},
		
		setJqueryMap, toggleDataSlider, setParamMap, initModule,
		browserSupportFileUpload, uploadCSV, getData, getParams,
		onChangeUploadCSV, onClickParamBtn, onClickSlide, onClickExampleData;
	//----------------END MODULE SCOPE VARIABLES----------------------
	
	//----------------BEGIN UTILITY METHODS---------------------------
	
	// Checks browser can handle file upload
	browserSupportFileUpload = function () {
		var isCompatible = false;
			if (window.File && window.FileReader && window.FileList && window.Blob) {
				isCompatible = true;
			}
		return isCompatible;
	};
	
	// Reads and processes the selected CSV file, saves as array to bookData[]
	function uploadCSV(evt) {
		if (!browserSupportFileUpload()) {
			alert('The File APIs are not fully supported in this browser!');
		} else {
			var data = null;
			var file = evt.target.files[0];
			var reader = new FileReader();
			reader.readAsText(file);
			reader.onload = function(event) {
				var csvData = event.target.result;
				data = $.csv.toArrays(csvData);
				if (data && data.length > 0) {
					bookData = data;
					console.table(bookData[2]);
				} else {
				  	alert('No data to import!');
				}
			};
			reader.onerror = function() {
				alert('Unable to read ' + file.fileName);
			};
		}
	};
	
	// Set bookData to example dataset
	function setExampleData() {
		bookData = configMap.exampleData;		
	};
	
	//----------------END UTILITY METHODS-----------------------------
	
	//----------------BEGIN DOM METHODS-------------------------------
	// Begin DOM method /setJqueryMap/
	setJqueryMap = function () {
		var $container = stateMap.$container;
		jqueryMap = { 
			$data		: 	$container,
			$closer		:	$container.find( '.bsv-data-close'),
			$params		: 	$container.find( '.bsv-data-params'),
			$ppmm		:	$container.find( '#bsv-data-params-ppmm'),
			$marcCol	:	$container.find( '#bsv-data-params-marcCol'),
			$clothpb	:	$container.find( '#bsv-data-params-clothpb'),
			$parambtn	:	$container.find( '#bsv-data-params-enter'),
			$datacsv	:	$container.find( '#bsv-data-data-csv'),
			$dataenter	:	$container.find( '#bsv-data-data-enter'),
		};
	};
	// End DOM method /setJqueryMap/	

	// Begin DOM method / toggleDataSlider /
	// Purpose:		Opens and closes right-hand slider
	// Arguments: 	
	//		* do-extend  - if true, extends; if false, retracts slider
	//		* callback   - optional function when slider open/closed
	// Returns:	
	//		* true
	
	toggleDataSlider = function ( do_extend, callback ) {
	
		if ( do_extend ) {
			jqueryMap.$data.animate (
				{right : configMap.dataSlider_extend_width},
				configMap.dataSlider_extend_time,
				function () {
					jqueryMap.$closer
					.attr('title', configMap.dataSlider_out_title)
					.text('X');
					stateMap.is_dataSlider_in = false;
					if (callback) {callback (jqueryMap.$data);}
				}
			);
			return true;
		}
			
		jqueryMap.$data.animate (
			{right : configMap.dataSlider_retract_width},
			configMap.dataSlider_retract_time,
			function () {
				jqueryMap.$closer
					.attr('title', configMap.dataSlider_in_title)
					.text('<');
				stateMap.is_dataSlider_in = true;
				if (callback) {callback (jqueryMap.$data);}
			}
		);
		return true;		
	};
	
	// End DOM method / toggleDataSlider /

	// Begin DOM method / setParamMap /
	// Purpose:		records updated parameters in stateMap
	// Arguments: 	none
	// Returns:		nothing
	setParamMap = function () {
		paramMap = {
 			ppmm	:	jqueryMap.$ppmm.val(),
			marcCol	:	jqueryMap.$marcCol.val(),
			clothpb	:	jqueryMap.$clothpb.val(),		
		};
	console.log(paramMap.ppmm + " " + paramMap.marcCol + " " + paramMap.clothpb);
	};
	// End DOM method / setParamMap /

	//----------------END DOM METHODS---------------------------------

	//----------------BEGIN EVENT HANDLERS----------------------------
	onClickSlide = function (event) {
		toggleDataSlider(stateMap.is_dataSlider_in);
		return false;
	};
	
	onClickParamBtn = function (event) {
		setParamMap();
		return false;
	};
	
	onChangeUploadCSV = function (event) {
		uploadCSV(event);
		return false;
	};
	
	onClickExampleData = function (event) {
		setExampleData();
		return false;
	};
	
	
	//----------------END EVENT HANDLERS------------------------------
	
	//----------------BEGIN PUBLIC METHODS----------------------------
	// Begin Public method /initModule/
	initModule = function ( $container ) {
		// Load HTML and map jQuery collections
		stateMap.$container = $container;
		$container.html( configMap.main_html );
		setJqueryMap();
		// Load up example dataset
		setExampleData();
		setParamMap();
		// Initialise slider and bind event handlers
		jqueryMap.$closer
			.attr('title', configMap.dataSlider_in_title)
			.click( onClickSlide );
			
		jqueryMap.$parambtn
			.click( onClickParamBtn );
		
		jqueryMap.$datacsv
			.change( onChangeUploadCSV );
			
		jqueryMap.$dataenter
			.click( onClickExampleData );


	};
	// End Public method /initModule/
	

	getData = function () {
		return bookData;
	};
	
	getParams	= function (param) {
		return paramMap[param];
	};

	
	return { 
		initModule 	: initModule,
		getData		: getData,
		getParams	: getParams,
		};
	//----------------END PUBLIC METHODS------------------------------	
}());
