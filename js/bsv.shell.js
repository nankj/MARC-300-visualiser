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
			+		'<div id="sig">Bookshelf Visualiser</div>'
			+		'<div class="bsv-shell-head-btn" id="btn1"></div>'
			+		'<div class="bsv-shell-head-btn" id="btn2"></div>'
			+		'<div class="bsv-shell-head-btn" id="btn3">About</div>'
			+		'<div class="bsv-shell-head-btn" id="btn4"></div>'	
			+	'</div>'
			+	'<div class="bsv-shell-main">'
			+	'</div>'
			+	'<div class="bsv-shell-intro-modal">'
			+		'<div class="bsv-shell-intro-modal-content">'
			+		'<h2>Convert MARC data into shelves</h2>'
			+		'<p>Large libraries have difficulty knowing how much space their stock occupies. The '
			+		'standard cataloguing format for books includes a height measure, but does not record the '
			+		'width. So the crucial figure of how many linear metres of shelving are occupied cannot '
			+		'readily be calculated from the data alone. Instead, library staff have to crack out the '
			+		'tape measure and the clipboard, and hole up for days (or weeks) in the stacks. </p>'
			+		'<p>This tool aims to take some of the pain out of this tedious labour. It works with MARC 21, '
			+		'using the physical description field (300|a) and other readily available metadata '
			+		'as a proxy for the missing width value. Users can upload a CSV file, which will be '
			+		'interpreted onscreen, providing a shelf-by shelf account of the space occupied.</p>'
			+		'<p><b>Note:</b> In its current form this is a proof of concept. The height value '
			+		'is missing, the width formula is '
			+		'still very much under development, and the data collection that forms the basis of this '
			+		'research is still ongoing. So at present (Dec \'18) any results it gives are probably wrong, '
			+		'and certainly provisional. Watch out for developments here!</p>'
			+	'<div class="bsv-shell-intro-modal-exampledata"></div>'
			+	'<div class="bsv-shell-intro-modal-choosedata"></div>'		
			+	'</div>'
			+	'</div>'
			+	'<div class="bsv-shell-data-modal"></div>'			
			+	'<div class="bsv-shell-foot">Created by Joe Nankivell, &copy; 2018</div>'
			+	'<div class="bsv-shell-start">'
			+		'<div class="bsv-shell-start-SVG"></div>'
			+		'<div class="bsv-shell-start-button"></div>'
			+	'</div>',
			
			startPageSVG : 	{
				titleSVG	: 	{
					viewBox	: "0 0 996 310",
					"class"	: "titleSVG"
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
		
		makeSVG, setJqueryMap, makeStartPage, onClickParams, onClickLogData, 
		onClickDataModal, onClickStart, onClickCloseIntro, initModule;
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
			$data		: $container.find( '.bsv-shell-data-modal'),
			$main		: $container.find( '.bsv-shell-main'),
			$test		: $container.find( '.bsv-shell-main-test'),
			$live		: $container.find( '.bsv-shell-main-live'),
			$start		: $container.find( '.bsv-shell-start'),
			$startSVG	: $container.find( '.bsv-shell-start-SVG'),
			$startbtn	: $container.find( '.bsv-shell-start-button'),
			$intro		: $container.find( '.bsv-shell-intro-modal'),
			$introbtn1	: $container.find( '.bsv-shell-intro-modal-exampledata'),
			$introbtn2	: $container.find( '.bsv-shell-intro-modal-choosedata'),
			$headbtns	: $container.find( '.bsv-shell-head-btn'),
			$btn1		: $container.find( '#btn1' ),					
			$btn2		: $container.find( '#btn2'),
			$btn3		: $container.find( '#btn3'),
			$btn4		: $container.find( '#btn4'),
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
			;
		
		bsv.data.setParam("is_comparison", false);
			
		title.innerHTML = "Bookshelf Visualiser";
		strapLine.innerHTML = "Measure your stock without leaving your desk";

// WILL NEED TO AMEND TO FIX DIV LOCATION 25-11-18
		div.append(shelfBox);	
		
		bsv.shelves.fillBay(data, 1, 0, bsv.data.getAllParams(), true);
		shelfBox.appendChild(title);	

		strapBox.appendChild(strapLine);
		div.append(strapBox);	
		return bsv.data.setParam("is_comparison", true);;
	};
	
	//----------------END DOM METHODS---------------------------------

	//----------------BEGIN EVENT HANDLERS----------------------------
	
	onClickParams = function ( event ) {
		console.log( bsv.data.getAllParams() );
		return false;
	};
	
	onClickLogData = function ( event ) {
		console.table( bsv.data.getData() );
		return false;
	};

	onClickDataModal = function ( event ) {
		jqueryMap.$intro.addClass('bsv-x-clearfloat')
		jqueryMap.$data.toggleClass('bsv-x-clearfloat');
		jqueryMap.$headbtns.removeClass('bsv-x-clearfloat');		
		return false;
	};
	
	onClickStart = function ( event ) {
		jqueryMap.$start.empty();
		jqueryMap.$start.addClass('bsv-x-clearfloat');
		return false;
	};	

	onClickCloseIntro = function ( event ) {
		jqueryMap.$intro.empty();
		jqueryMap.$intro.addClass('bsv-x-clearfloat');
		jqueryMap.$headbtns.removeClass('bsv-x-clearfloat');
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
				
		
		// initialise data and shelves modules
		bsv.data.initModule(jqueryMap.$data);
		bsv.shelves.initModule(jqueryMap.$main);

		// Load start page SVG
		makeStartPage(jqueryMap.$startSVG);

		// Hide data modal and header buttons
		jqueryMap.$data.addClass('bsv-x-clearfloat');
		jqueryMap.$headbtns.addClass('bsv-x-clearfloat');	

		// initialise buttons and bind click handlers
		
		jqueryMap.$btn1
			.text('')
			.attr('title', 'Log current book data')
			.click( onClickLogData );

		jqueryMap.$btn2
			.text('')
			.attr('title', 'Log current parameters')
			.click( onClickParams );

		jqueryMap.$btn4
			.text('Change data')
			.attr('title', 'Change data source')
			.click( onClickDataModal );
		
		jqueryMap.$startbtn
			.text('START')
			.attr('title', 'Turn your data into bookshelves')
			.click( onClickStart );

		jqueryMap.$introbtn1
			.text('Use example')
			.attr('title', 'Use example data')
			.click( onClickCloseIntro );

		jqueryMap.$introbtn2
			.text('Select data')
			.attr('title', 'Select a data source')
			.click( onClickDataModal );
			
	};
	// End Public method /initModule/
	

	return { 
		initModule 	: initModule
	};
	//----------------END PUBLIC METHODS------------------------------	
}());