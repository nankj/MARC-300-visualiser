/*
 * bsv.shell.js
 * Shell module for Bookshelf Visualiser
 */
 
 /* global variables: $, bsv */

bsv.shell = (function() {
	//----------------BEGIN MODULE SCOPE VARIABLES---------------------
	var 
		configMap = {
			main_html : String()
			+	'<div class="bsv-shell-head">'
			+		'<div class="bsv-shell-head-btn" id="btn1"></div>'
			+		'<div class="bsv-shell-head-btn" id="btn2"></div>'
			+		'<div class="bsv-shell-head-btn" id="btn3"></div>'
			+		'<div class="bsv-shell-head-btn" id="btn4"></div>'
			+		'<div class="bsv-shell-head-btn" id="btn5"></div>'
			+		'<div class="bsv-shell-head-btn" id="btn6"></div>'			
			+	'</div>'
			+	'<div class="bsv-shell-main">'
			+	'</div>'
			+	'<div class="bsv-shell-data"></div>'
			+	'<div class="bsv-shell-foot"></div>'
			+	'<div class="bsv-shell-data-modal"></div>'
			+	'<div class="bsv-shell-start">'
			+		'<div class="bsv-shell-start-SVG"></div>'
			+		'<div class="bsv-shell-start-button"></div>'
			+	'</div>',
			
			startPageSVG : 	{
				titleSVG	: 	{
					viewBox	: "0 0 996 310",
					},
				strapSVG	: 	{
					viewBox	: "0 0 996 110",
					}
			},

		},
		stateMap  = { 
			$container 		: null,
		},
		jqueryMap =	{},
		
		makeSVG, setJqueryMap, makeStartPage,
		onClickParams, onClickLogData, onClickStart, initModule;
	//----------------END MODULE SCOPE VARIABLES----------------------
	
	//----------------BEGIN UTILITY METHODS---------------------------
	
	// Create an SVG. Parameters are type, and as many attributes as needed as an object
	makeSVG = function(type, attrs){
		var result = document.createElementNS("http://www.w3.org/2000/svg", type);
		if (attrs) {
			for (var key in attrs) {
				if (attrs.hasOwnProperty(key)) {
					result.setAttributeNS(null, key, attrs[key]);
				}
			}
		}
		return result;
	};
	
	//----------------END UTILITY METHODS-----------------------------
	
	//----------------BEGIN DOM METHODS-------------------------------
	// Begin DOM method /setJqueryMap/
	setJqueryMap = function () {
		var $container = stateMap.$container;
		jqueryMap = { 
			$container 	: $container,
			$data		: $container.find( '.bsv-shell-data'),
			$main		: $container.find( '.bsv-shell-main'),
			$test		: $container.find( '.bsv-shell-main-test'),
			$live		: $container.find( '.bsv-shell-main-live'),
			$start		: $container.find( '.bsv-shell-start'),
			$startSVG	: $container.find( '.bsv-shell-start-SVG'),
			$startbtn	: $container.find( '.bsv-shell-start-button'),			
			$btn2		: $container.find( '#btn2'),
			$btn3		: $container.find( '#btn3'),
		};
	};
	// End DOM method /setJqueryMap/	
	
	makeStartPage = function ( div ) {
		var	data 	= bsv.data.getData(),
			shelfBox	= makeSVG("svg", configMap.startPageSVG.titleSVG),
			strapBox	= makeSVG("svg", configMap.startPageSVG.strapSVG),
			title 	= makeSVG("text", {
				x					: "50%",
				y					: "60%",
				"text-anchor"		: "middle",
				"dominant-baseline"	: "middle",
				"class"				: "titleText",	
			}),
			strapLine 	= makeSVG("text", {
				x					: "50%",
				y					: "40%",
				"text-anchor"		: "middle",
				"dominant-baseline"	: "middle",
				"class"				: "strapline",	
			})
/*			startButton = makeSVG("rect", {
				x					: "44%",
				y					: "40%",
				width				: "12%",
				height				: "20%",
				rx					: "8",
				ry					: "8",				
				fill				: "#F2F1EF",
				"class"				: "bsv-shell-start-button"
			}),
			startButtonText 	= makeSVG("text", {
				x					: "50%",
				y					: "50%",
				"text-anchor"		: "middle",
				"dominant-baseline"	: "middle",				
				fill				: "red",
				"class"				: "bsv-shell-start-button-text"
			})
*/			;
			
		title.innerHTML = "Bookshelf Visualiser";
		strapLine.innerHTML = "Measure your stock without leaving your desk";
//		startButtonText.innerHTML = "Start";
		
		div.append(shelfBox);	
		bsv.shelves.fillBay(data, 1, 0, shelfBox, true, true);
		shelfBox.appendChild(title);	

		strapBox.appendChild(strapLine);
//		strapBox.appendChild(startButton);
//		strapBox.appendChild(startButtonText);
		div.append(strapBox);	
		return true;
	};
	
	//----------------END DOM METHODS---------------------------------

	//----------------BEGIN EVENT HANDLERS----------------------------
	
	onClickParams = function ( event ) {
		console.log( bsv.data.getParams('ppmm') );
		return false;
	};
	
	onClickLogData = function ( event ) {
		console.table( bsv.data.getData() );
		return false;
	};
	
	onClickStart = function ( event ) {
		jqueryMap.$start.empty();
		jqueryMap.$start.addClass('bsv-x-clearfloat');
		return false;
	};	
	//----------------END EVENT HANDLERS------------------------------
	
	//----------------BEGIN PUBLIC METHODS----------------------------
	// Begin Public method /initModule/
	initModule = function ( $container ) {
		// load HTML and map jQuery collections
		stateMap.$container = $container;
		$container.html( configMap.main_html );
		setJqueryMap();
				

		// set view to live tool
		jqueryMap.$test
			.addClass('bsv-x-clearfloat');
			
		// initialise data and shelves modules
		bsv.data.initModule(jqueryMap.$data);
		bsv.shelves.initModule(jqueryMap.$main);

		// Load start page SVG
		makeStartPage(jqueryMap.$startSVG);

		// initialise buttons and bind click handlers

		jqueryMap.$btn2
			.text('Params')
			.attr('title', 'Log current parameters')
			.click( onClickParams );
		
		jqueryMap.$btn3
			.text('Data')
			.attr('title', 'Log current book data')
			.click( onClickLogData );
		
		jqueryMap.$startbtn
			.text('START')
			.attr('title', 'Click to turn your data into bookshelves')
			.click( onClickStart );
			


	};
	// End Public method /initModule/
	
	return { initModule : initModule };
	//----------------END PUBLIC METHODS------------------------------	
}());