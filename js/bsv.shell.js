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
			+		'<div class="bsv-shell-head-btn" id="btn4">render</div>'
			+	'</div>'
			+	'<div class="bsv-shell-main">'	
			+	'</div>'
			+	'<div class="bsv-shell-slider"></div>'
			+	'<div class="bsv-shell-foot"></div>'			
		},
		stateMap  = { 
			$container 		: null,
		},
		jqueryMap =	{},
		
		setJqueryMap, toggleTest, onClickToggle, initModule,
		onClickParams, onClickLogData ;
	//----------------END MODULE SCOPE VARIABLES----------------------
	
	//----------------BEGIN UTILITY METHODS---------------------------
	//----------------END UTILITY METHODS-----------------------------
	
	//----------------BEGIN DOM METHODS-------------------------------
	// Begin DOM method /setJqueryMap/
	setJqueryMap = function () {
		var $container = stateMap.$container;
		jqueryMap = { 
			$container 	: $container,
			$slider		: $container.find( '.bsv-shell-slider'),
			$main		: $container.find( '.bsv-shell-main'),
			$test		: $container.find( '.bsv-shell-main-test'),
			$live		: $container.find( '.bsv-shell-main-live'), 
			$btn2		: $container.find( '#btn2'),
			$btn3		: $container.find( '#btn3'),
		};
	};
	// End DOM method /setJqueryMap/	

	//----------------END DOM METHODS---------------------------------

	//----------------BEGIN EVENT HANDLERS----------------------------
	
	onClickParams = function ( event ) {
		console.log( bsv.slider.getParams('ppmm') );
		return false;
	};
	
	onClickLogData = function ( event ) {
		console.table( bsv.slider.getData() );
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
				
		// initialise buttons and bind click handlers

		jqueryMap.$btn2
			.text('Params')
			.attr('title', 'Log current parameters')
			.click( onClickParams );
		
		jqueryMap.$btn3
			.text('Data')
			.attr('title', 'Log current book data')
			.click( onClickLogData );

		// set view to live tool
		jqueryMap.$test
			.addClass('bsv-x-clearfloat');
		// initialise slider and shelves modules
		bsv.slider.initModule(jqueryMap.$slider);
		bsv.shelves.initModule(jqueryMap.$main);


	};
	// End Public method /initModule/
	
	return { initModule : initModule };
	//----------------END PUBLIC METHODS------------------------------	
}());