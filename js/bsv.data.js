/*
 * bsv.data.js
 * Feature module, slider to set parameters
 */
 
 /* global variables: $, bsv */


bsv.data = (function() {
	//----------------BEGIN MODULE SCOPE VARIABLES---------------------
	var 
		configMap = {
			main_html : String()
			+	'<div class="bsv-data-close">\<</div>'
			+	'<div class="bsv-data-params">'
				+	'<fieldset>'	
				+		'<legend>Set parameters</legend>'
//				+		'<form id="data-params-form">'
				+			'<div>'
				+				'<label for="bsv-data-params-ppmm">Pages/mm:</label>'
				+				'<input type="text" id="bsv-data-params-ppmm" value="11.89"/>'
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
			+					'<label for="bsv-data-data-enter">Example data</label>'
			+					'<button id="bsv-data-data-enter" class="button">Use</button>'
			+				'</div>'		
			+				'<hr>'
			+				'<div>'
			+					'<label for="bsv-data-data-csv">Import CSV file</label><br>'
			+					'<input type="file" name="File upload" id="bsv-data-data-csv" accept=".csv"/>'
			+				'</div>'
				+			'<div>'
				+				'<label for="bsv-data-params-marcCol">MARC 300 col:</label>'
				+				'<input type="text" id="bsv-data-params-marcCol" value="7"/>'
				+			'</div>'	
				+			'<div>'
				+				'<label for="bsv-data-params-widthCol">Width col:</label>'
				+				'<input type="text" id="bsv-data-params-widthCol" value="1"/>'
				+			'</div>'
				+			'<div>'
				+				'<label for="bsv-data-params-heightCol">Height col:</label>'
				+				'<input type="text" id="bsv-data-params-heightCol" value="2"/>'
				+			'</div>'
				+			'<div>'
				+				'<label for="bsv-data-params-shelfCol">Shelf ID col:</label>'
				+				'<input type="text" id="bsv-data-params-shelfCol" value="3"/>'
				+			'</div>'				
//			+			'</form>'
			+		'</fieldset>'
			+	'</div>',
			dataSlider_extend_time		:	300,
			dataSlider_retract_time		:	300,
			dataSlider_extend_width		:	0,
			dataSlider_retract_width	:	-415,
			dataSlider_out_title		:	'Click to close',
			dataSlider_in_title			:	'Click to change parameters',
			average_page_count			:	'296 (est.)',
//								0:Barcode,1:Item Number,2:Bib,3:300a,4:260c,5:Title,6:Width,7:Height,8:Binding,9:Shelf ID
			exampleData	:	   [["Barcode","Item Number","Bib","MARC 300a","MARC 260c","Title","Width","Height","Binding","Shelf ID"],
								["11046204","i10012199","b1001021x","0","","EARLY VATICINATION IN WELSH.","26.9","23","c","2.101A"],
								["11057420","i10286226","b10253129","","","HELDEN AUF FREIERSFUSSEN.","29.6","27","p","2.101A"],
								["11068595","i10300934","b10266811","","1982","Cymru yn llenyddiaeth Cymru.","8.1","22","c","2.101A"],
								["11098378","i10645883","b10561432","xiii,322p ;","1987","A book of Wales : an anthology / selected by Meic Stephens.","31.6","25","c","2.101A"],
								["11068461","i1079301x","b10683951","20p ;","1982","Llafar a llyfr yn yr hen gyfnod : darlith goffa G.J. Williams : traddodwyd yng Ngholeg y Brifysgol, Caerdydd ar 20 Tachwedd 1980 / gan D. Simon Evans.","7.9","22","c","2.101A"],
								["12001654","i10793392","b10684311","93p :","1986","Medieval religious literature / D. Simon Evans.","14.2","25","c","2.101A"],
								["12029080","i10920559","b10787008","78p :","1989","Llenyddiaeth y Cymry : cyflwyniad darluniadol. Cyf. 2, O tua 1530 i tua 1880 / gan R. Geraint Gruffydd.","6.8","25","p","2.101A"],
								["11030759","i10966675","b10828898","67p ;","1979","Elusen i'r enaid : arweiniad i weithiau'r Piwritaniaid Cymreig, 1630-1689 / (gan) Noel Gibbard.","7","19","p","2.101A"],
								["11020528","i1134037x","b11157811","189p","1972","Ysgrifennu creadigol (Darlithiau Taliesin). Golygydd: Geraint Bowen.","19","23","c","2.101A"],
								["11034604","i11536299","b11326931","xx, 201p, (5) leaves of plates :","1980","The beginnings of Welsh poetry : studies / by Sir Ifor Williams ; edited by Rachel Bromwich.","20.7","24","c","2.101A"],
								["12058340","i11585894","b1136578x","156p ;","1991","Yr Hen Ganrif : beirniadaeth Lenyddol W. J. Gruffydd / golygdd Bobi Jones.","11.2","22","p","2.101A"],
								["11068865","i11676905","b11438782","222p,(1)leaf of plates :","c1982.","Beirniadaeth lenyddol : erthyglau / gan Hugh Bevan ; wedi'u dethol a'u golygu gan Brynley F. Roberts.","22.9","23","c","2.101A"],
								["12084585","i12042535","b11709728","viii,336 p ;","1975","Peredur : a study of Welsh tradition in the Grail legends / by Glenys Goetinck.","26.6","23","c","2.101A"],
								["11076980","i12263801","b11872159","400p,(8)p of plates :","1979","A guide to Welsh literature / edited by A.O.H. Jarman and Gwilym Rees Hughes. Vol.2.","33.3","22","c","2.101A"],
								["12102451","i12460515","b12020035","","1992","A guide to Welsh literature / edited by A.O.H. Jarman and Gwilym R ees Hughes. Vol.1.","20.5","22","p","2.101A"],
								["12150214","i1258213x","b12106574","145p :","1994","The literature of Wales / Dafydd Johnston.","9.5","19","p","2.101A"],
								["12150215","i12582141","b12106574","145p :","1994","The literature of Wales / Dafydd Johnston.","8.7","19","p","2.101A"],
								["12156854","i12582165","b12106574","145p :","1994","The literature of Wales / Dafydd Johnston.","10.6","19","p","2.101A"],
								["11031269","i13067278","b12444443","xvi,230p ;","(1979).","Cyfansoddiadau a beirniadaethau. Caernarfon a'r cylch / golygydd T.M. Bassett.","15.2","22","p","2.101A"],
								["12160266","i13746625","b12985557","174p ;","1997","Medieval Welsh literature / Andrew Breeze.","20","25","c","2.101A"],
								["16074310","i14473562","b1364855x","128 p ;","1973","Welsh poems, sixth century to 1600 / translated with an introduction and notes by Gwyn Williams.","11.7","20","p","2.101A"],
								["16074311","i14473574","b1364855x","128 p ;","1973","Welsh poems, sixth century to 1600 / translated with an introduction and notes by Gwyn Williams.","10.6","20","p","2.101A"],
								["16074306","i14473586","b13648561","xvi, 156 p., [5] leaves of plates :","1954","Morgan Llwyd y llenor / gan Hugh Bevan.","19","22","c","2.101A"],
								["16074354","i14473598","b13648573","391 p., 6 plates :","1970","Y Traddodiad rhyddiaith (darlithiau Rhydychen) / golygydd: Geraint Bowen.","36","23","c","2.101A"],
								["16074353","i14473604","b13648585","443 p., [6] leaves of plates :","1974","Y traddodiadd rhyddiaith yn yr Oesau Canol : (darlithiau Dewi Sant) / golygydd Geraint Bowen.","41.2","22","c","2.101A"],
								["16074352","i14473616","b13648597","ix, 86 p., [8] leaves of plates :","1958","Gruffudd Hiraethog a'i oes / gan D. J. Bowen.","10.4","19","c","2.101A"],
								["16074351","i14473628","b13648603","xii, 390 p., [2] leaves of plates :","1978","Astudiaethau ar yr hengerdd = : Studies in old Welsh poetry / golygwyd gan Rachel Bromwich a R. Brinley Jones.","36.1","23","c","2.101A"],
								["16074349","i1447363x","b13648615","[11], 85 p :","1976","Yr Eisteddfod : cyfrol ddathlu wythganmlwyddiant yr Eisteddfod, 1176-1976 / [gan] Hywel Teifi Edwards.","14.7","22","c","2.101A"],
								["16074347","i14473641","b13648627","xvi, 280 p., 4 plates :","1967","Lewis Edwards : ei fywyd a'i waith.","26.6","23","c","2.101A"],
								["16074346","i14473653","b13648639","69 p ;","1968","Twf fr Eisteddfod : tair darlith, gan Helen Ramage, Melville Richards, Frank Price Jones / wedi eu golygugan Idris Foster.","11.4","21","c","2.101A"],
								["16074355","i14473689","b13648664","129 p ;","1977","Cwmwl o dystion / golygydd E. Wyn James.","7.6","21","p","2.101A"],
								["16074370","i14473690","b13648676","v :","-1976","A guide to Welsh literature / edited by A. O. H. Jarman and Gwilym Rees Hughes.","32.6","23","c","2.101A"],
								["16074367","i14473707","b13648688","20 p ;","1966","Y stori fer Gymraeg.","8.3","19","c","2.101A"],
								["16074357","i14473720","b13648706","40 p ;","1963","Guto'r Glyn a'i gyfnod / gan Bobi Jones.","8.9","19","c","2.101A"],
								["16074364","i14473744","b1364872x","119 p ;","1957","Y gelfyddyd lenyddol yng Nghymru.","12","19","c","2.101A"],
								["16074366","i14473756","b13648731","329 p., plate :","1977","Swyddogaeth beirniadaeth ac ysgrifau eraill / [gan] John Gwilym Jones.","33.6","23","c","2.101A"],
								["16074348","i14484365","b1365746x","110 p ;","1976","Y crefftwyr ac ysgrifau eraill.","9.3","22","p","2.101A"],
								["12173158","i15058554","b14166732","x,143p :","1998","Llenyddiaeth Cymru : llyfr poced / Dafydd Johnston.","8.9","19","p","2.101A"],
								["12172768","i15058712","b14166872","xii,195p ;","1998","Welsh literature and the Classical tradition / Ceri Davies.","16.6","22","p","2.101A"],
								["16074350","i15984898","b15021427","167 p., [12] leaves of plates :","c1971.","Athrawon ac Annibynwyr : portreadau ac astudiaethau / gan J. Alwyn Charles ... [et al.] ; o dan olygyddiaeth Pennar Davies.","18.8","23","c","2.101A"],
								["16074356","i16044988","b15078905","xiii, 166 p ;","1951","Rhagymadroddion, 1547-1659 / golygwyd gan Garfield H. Hughes.","18.9","19","c","2.101A"],
								["12189840","i16223640","b15239184","ix,284p.","1997","Cerddi alltudiaeth : thema yn llenyddiaethau QuÃ©bec, Catalunya a Chymru.","16","22","p","2.101A"],
								["12189848","i16223962","b15239573","viii,375p ;","1997","A guide to Welsh literature. Volume II, 1282-c.1550 / edited by A. O. H. Jarman and Gwilym Rees Hughes.","19.4","22","p","2.101A"],
								["12323222","i19639971","b18600815","xvii, 491p. ;","2005","LlÃªn yr uchelwyr : hanes beirniadol llenyddiaeth Gymraeg 1300-1525 / Dafydd Johnston.","30.2","25","c","2.101A"],
								["12357171","i21260333","b20920969","xxiv, 317 p. ;","2013","Darogan : prophecy, lament and absent heroes in medieval Welsh literature / Aled Llion Jones.","32.3","23","c","2.101A"],
								["16180884","i21823078","b21390368","86p. ;","1977","Crefft y llenor / John Gwilym Jones.","12.2","23","c","2.101A"],
								["12323222","i19639971","b18600815","xvii, 491p. ;","2005","LlÃªn yr uchelwyr : hanes beirniadol llenyddiaeth Gymraeg 1300-1525 / Dafydd Johnston.","30.2","25","c","2.101A"],
								["16074306","i14473586","b13648561","xvi, 156 p., [5] leaves of plates :","1954","Morgan Llwyd y llenor / gan Hugh Bevan.","19","22","c","2.101A"],
								["12029080","i10920559","b10787008","78p :","1989","Llenyddiaeth y Cymry : cyflwyniad darluniadol. Cyf. 2, O tua 1530 i tua 1880 / gan R. Geraint Gruffydd.","12","24","p","2.101A"],								
								["12189840","i16223640","b15239184","ix,284p.","1997","Cerddi alltudiaeth : thema yn llenyddiaethau QuÃ©bec, Catalunya a Chymru.","16","21","p","2.101A"],
								["12001654","i10793392","b10684311","93p :","1986","Medieval religious literature / D. Simon Evans.","14.2","25","c","2.101B"]]
			
		},
		stateMap  = { 
			$container 			: null,
			is_dataSlider_in	: true,
			shelf_id_exists 	: false
		},
		paramMap  = {},
		bookData  = [],
		jqueryMap =	{},
		
		setJqueryMap, toggleDataSlider, setParamMap, initModule,
		browserSupportFileUpload, uploadCSV, setExampleData, numberRange,
		convertRoman, sumIntegers, marc300ToWidth, mapShelfIDs, getData, getParams,
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
	uploadCSV = function(evt) {
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
					bookData = marc300ToWidth(data, paramMap.marcCol);
					paramMap.shelf_id = mapShelfIDs(bookData);
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
	setExampleData = function() {
//		bookData = configMap.exampleData;
		paramMap.marcCol 	= 3;
		paramMap.widthCol	= 6;
		paramMap.heightCol	= 7;
		paramMap.shelfCol	= 9;
 		paramMap.ppmm		=	jqueryMap.$ppmm.val();
		bookData = marc300ToWidth(configMap.exampleData, paramMap.marcCol);	
		paramMap.shelf_id = mapShelfIDs(bookData);	
		jqueryMap.$datacsv.val("");
		jqueryMap.$dataenter.text("Loaded");		
	};
	
	// Handle number ranges in MARC 300
	numberRange = function (all, a, b) {
		return Number(b) - Number(a);
	};
	
	// Handle roman numerals in MARC 300
	convertRoman = function (match){
		function RomanNumber (value){
			if (typeof value === 'string') {
				let num = parse(value);
				this.toInt = function() { return num; }
			} else {
				throw 'Invalid value';
			}
		};	  
		function parse(str) {
			const VALUES = {
							'M' : 1000,
				'D' :  500, 'C' :  100,
				'L' :   50, 'X' :   10,
				'V' :    5, 'I' :    1,
			};
			str = str.toUpperCase();
			let prev = 0, sum = 0;
			for (let i = 0; i < str.length; i++) {
				let curr = VALUES[str[i]];
				sum += (prev < curr) 	? curr - 2 * prev
										: curr;
				prev = curr;
			}
			return sum;
		}	
		var result = new RomanNumber(match);
		return result.toInt();
	};

	// Add all numbers after cleanup in MARC 300
	sumIntegers = function (source){
		var result = 0;
		source.replace(
			/\d{1,}/g,
			function(int){
				int = Number(int);
				return result += int;    
			}
		);
		return result;    
	};


	// Arguments: array is 2D array from CSV; col is the column that holds the MARC 300
	// If we've run this procedure already, replaces contents of final column.
	// Otherwise adds a column with estimated width.
	marc300ToWidth = function(array, col) {
		var regexRoman			= /[mdlcxvi]{1,6}(?= |,|-|p)/g,
			regexNumberRange	= /([\d]{1,4})-([\d]{1,4})/g,
			regexBadHyphens		= / ?(?:\-)(?: )?/g,
			regexClearBrackets	= /[\[\] ]/g,
			totalCols 			= array[0].length-1,
			firstTime, i;
		
		array[0][totalCols]=="MARC Width"	? firstTime = false 
											: firstTime = true;
		
		for (i = 0 ; i < array.length ; i++){
			if (!firstTime) {array[i].pop()};
			if (array[i][col] == "0" || array[i][col] === "") {array[i][col] = configMap.average_page_count};
			// *1* Convert roman to integer, fix hyphens and brackets, handle ranges
			var result = array[i][col].replace(regexRoman, convertRoman)
									  .replace(regexBadHyphens,"-")
									  .replace(regexClearBrackets, ",")
									  .replace(regexNumberRange, numberRange);
			// *2* sum all integers
			result = sumIntegers(result);
			// *3* convert page number to width
			result = result / Number(paramMap.ppmm);
			// *4* add resulting width to end of row
			array[i].push(result);
		}
		firstTime 	? array[0][totalCols+1]="MARC Width"
					: array[0][totalCols]="MARC Width";
		return array;
	};
	
	mapShelfIDs = function (data) {
		var col 	= paramMap.shelfCol,
			result 	= [],
			i, shelf;
		for (i = 0 ; i < data.length ; i++) {
			shelf = data[i][col];
			result.indexOf(shelf) == -1	? result.push(shelf)
										: result;
		}
		return result;
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
			$widthCol	:	$container.find( '#bsv-data-params-widthCol'),
			$heightCol	:	$container.find( '#bsv-data-params-heightCol'),
			$shelfCol	:	$container.find( '#bsv-data-params-shelfCol'),
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
	// Purpose:		Records updated parameters in paramMap
	// 				and applies them to data, if defined 
	// Arguments: 	none
	// Returns:		nothing
	setParamMap = function () {
		paramMap = {
 			ppmm		:	jqueryMap.$ppmm.val(),
			marcCol		:	jqueryMap.$marcCol.val(),
			clothpb		:	jqueryMap.$clothpb.val(),
			widthCol	:	jqueryMap.$widthCol.val(),
			heightCol	:	jqueryMap.$heightCol.val(),
			shelfCol	:	jqueryMap.$shelfCol.val(),
		};
		if (bookData[0]) {
			bookData = marc300ToWidth(bookData, paramMap.marcCol);
			if (paramMap.shelfCol > 0) {
				stateMap.shelf_id_exists = true; 
				paramMap.shelf_id = mapShelfIDs(bookData);
			} else { 
				stateMap.shelf_id_exists = false; 
				paramMap.shelf_id = null;
			}
		}
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
		toggleDataSlider(false);
		return false;
	};
	
	onChangeUploadCSV = function (event) {
		setParamMap();
		uploadCSV(event);
		jqueryMap.$dataenter.text("Use");
		toggleDataSlider(false);
		return false;
	};
	
	onClickExampleData = function (event) {
		setExampleData();
		toggleDataSlider(false);
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

		setParamMap();
		setExampleData();
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
	
	setParam = function (param, val)	{
		paramMap[param] = val;
	};

	
	return { 
		initModule 	: initModule,
		getData		: getData,
		getParams	: getParams,
		setParam	: setParam
		};
	//----------------END PUBLIC METHODS------------------------------	
}());
