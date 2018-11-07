/*
 * bsv.slider.js
 * Feature module, slider to set parameters
 */
 
 /* global variables: $, bsv */

bsv.slider = (function() {
	//----------------BEGIN MODULE SCOPE VARIABLES---------------------
	var 
		configMap = {
			main_html : String()
			+	'<div class="bsv-slider-close">\<</div>'
			+	'<hr>'
			+	'<div class="bsv-slider-params">'
				+	'<fieldset>'	
				+		'<legend>Set parameters</legend>'
//				+		'<form id="slider-params-form">'
				+			'<div>'
				+				'<label for="bsv-slider-params-ppmm">Pages/mm:</label>'
				+				'<input type="text" id="bsv-slider-params-ppmm" value="14"/>'
				+			'</div>'
				+			'<div>'
				+				'<label for="bsv-slider-params-marcCol">MARC 300 col:</label>'
				+				'<input type="text" id="bsv-slider-params-marcCol" value="2"/>'
				+			'</div>'			
				+			'<div>'
				+				'<label for="bsv-slider-params-clothpb">Cloth ratio:</label>'
				+				'<input type="text" id="bsv-slider-params-clothpb"/>'
				+			'</div>'
				+			'<div>'
				+				'<label for="bsv-slider-params-enter"></label>'
				+				'<button id="bsv-slider-params-enter" class="button">Enter</button>'
				+			'</div>'
//				+		'</form>'
				+	'</fieldset>'
			+	'</div>'
			+	'<div>'
			+		'<fieldset class="bsv-slider-data">'	
			+			'<legend>Choose data source</legend>'
//			+			'<form>'
			+				'<div>'
			+					'<label for="bsv-slider-data-csv">Import CSV file</label><br>'
			+					'<input type="file" name="File upload" id="bsv-slider-data-csv" accept=".csv"/>'
			+				'</div>'
			+				'<div>'
			+					'<label for="bsv-slider-data-enter">Example data</label>'
			+					'<button id="bsv-slider-data-enter" class="button">Use</button>'
			+				'</div>'		
//			+			'</form>'
			+		'</fieldset>'
			+	'</div>',
			slider_extend_time		:	600,
			slider_retract_time		:	600,
			slider_extend_width		:	0,
			slider_retract_width	:	-415,
			slider_out_title		:	'Click to close',
			slider_in_title			:	'Click to change parameters',
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
			is_slider_in	: true,
		},
		paramMap  = {},
		bookData  = [],
		jqueryMap =	{},
		
		setJqueryMap, toggleSlider, setParamMap, initModule,
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
			$slider		: 	$container,
			$closer		:	$container.find( '.bsv-slider-close'),
			$params		: 	$container.find( '.bsv-slider-params'),
			$ppmm		:	$container.find( '#bsv-slider-params-ppmm'),
			$marcCol	:	$container.find( '#bsv-slider-params-marcCol'),
			$clothpb	:	$container.find( '#bsv-slider-params-clothpb'),
			$parambtn	:	$container.find( '#bsv-slider-params-enter'),
			$datacsv	:	$container.find( '#bsv-slider-data-csv'),
			$dataenter	:	$container.find( '#bsv-slider-data-enter'),
		};
	};
	// End DOM method /setJqueryMap/	

	// Begin DOM method / toggleSlider /
	// Purpose:		Opens and closes right-hand slider
	// Arguments: 	
	//		* do-extend  - if true, extends; if false, retracts slider
	//		* callback   - optional function when slider open/closed
	// Returns:	
	//		* true
	
	toggleSlider = function ( do_extend, callback ) {
	
		if ( do_extend ) {
			jqueryMap.$slider.animate (
				{right : configMap.slider_extend_width},
				configMap.slider_extend_time,
				function () {
					jqueryMap.$closer
					.attr('title', configMap.slider_out_title)
					.text('X');
					stateMap.is_slider_in = false;
					if (callback) {callback (jqueryMap.$slider);}
				}
			);
			return true;
		}
			
		jqueryMap.$slider.animate (
			{right : configMap.slider_retract_width},
			configMap.slider_retract_time,
			function () {
				jqueryMap.$closer
					.attr('title', configMap.slider_in_title)
					.text('<');
				stateMap.is_slider_in = true;
				if (callback) {callback (jqueryMap.$slider);}
			}
		);
		return true;		
	};
	
	// End DOM method / toggleSlider /

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
		toggleSlider(stateMap.is_slider_in);
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
			.attr('title', configMap.slider_in_title)
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
