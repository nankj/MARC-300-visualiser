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
			+	'</div>'
			+	'<div class="bsv-shell-main">'	
			+		'<div class="bsv-shell-main-live">'
			+			'<div class="bsv-shell-main-live-width"></div>'
			+		'</div>'			
			+		'<div class="bsv-shell-main-test">'
			+			'<div class="bsv-shell-main-test-width"></div>'
			+			'<div class="bsv-shell-main-test-MARC" ></div>'
			+		'</div>'
			+	'</div>'
			+	'<div class="bsv-shell-slider"></div>'
			+	'<div class="bsv-shell-foot"></div>'			
		},
		stateMap  = { 
			$container 		: null,
			is_live_open	: true,
		},
		jqueryMap =	{},
		
		setJqueryMap, toggleTest, onClickToggle, toggleSlider, initModule,
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
			$test		: $container.find( '.bsv-shell-main-test'),
			$live		: $container.find( '.bsv-shell-main-live'),
			$btn		: $container.find( '#btn1'),
			$btn2		: $container.find( '#btn2'),
			$btn3		: $container.find( '#btn3'),
		};
	};
	// End DOM method /setJqueryMap/	

	// Begin DOM method /toggleTest/
	// Purpose:		Switch between test suite and live tool
	// Arguments: 	switch_to_test (boolean): true, to test; false, to live
	// Returns:	boolean
	//		* true		toggled
	//		* false 	not toggled
	// State:	sets stateMap.is_live_open
	//		* true		test suite
	//		* false		live tool
	
	toggleTest = function ( switch_to_test ) {
		if (switch_to_test) {
			jqueryMap.$test.removeClass('bsv-x-clearfloat');
			jqueryMap.$live.addClass('bsv-x-clearfloat');
			jqueryMap.$btn.text('Live').attr('title', 'Click to switch to live version');
			stateMap.is_live_open = false;
			return true;
		} 
	jqueryMap.$live.removeClass('bsv-x-clearfloat');
	jqueryMap.$test.addClass('bsv-x-clearfloat');	
	jqueryMap.$btn.text('Test').attr('title', 'Click to switch to test suite');
	stateMap.is_live_open = true;
	return true;
	};
	// End DOM method /toggleTest/

	//----------------END DOM METHODS---------------------------------

	//----------------BEGIN EVENT HANDLERS----------------------------
	onClickToggle = function ( event ) {
		toggleTest (stateMap.is_live_open);
		return false;
	};
	
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
		jqueryMap.$btn
			.text('Test')
			.attr('title', 'Click to switch to test suite')
			.click( onClickToggle );

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
		// initialise slider
		bsv.slider.initModule(jqueryMap.$slider);
		

//		test data from slider module
//		setTimeout( function () { console.log(bsv.slider.getData()[2]); }, 12000);		

	};
	// End Public method /initModule/
	
	return { initModule : initModule };
	//----------------END PUBLIC METHODS------------------------------	
}());