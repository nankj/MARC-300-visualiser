/*
 * bsv.shell.js
 * Shell module for Bookshelf Visualiser
 */
 
 /* global variables: $, bsv */

bsv.shelves = (function() {
	//----------------BEGIN MODULE SCOPE VARIABLES---------------------
	var 
		configMap = {
			main_html : String()
			+	'<div class="bsv-shelves-live">'
			+		'<div class="bsv-shelves-live-width"></div>'
			+	'</div>'			
			+	'<div class="bsv-shelves-test">'
			+		'<div class="bsv-shelves-test-width"></div>'
			+		'<div class="bsv-shelves-test-MARC" ></div>'
			+	'</div>'
		},
		stateMap  = { 
			$container 		: null,
			is_live_open	: true,			
		},
		jqueryMap =	{},
		
		setJqueryMap, makeShelf, fillShelves;
	//----------------END MODULE SCOPE VARIABLES----------------------
	
	//----------------BEGIN UTILITY METHODS---------------------------
	//----------------END UTILITY METHODS-----------------------------
	
	//----------------BEGIN DOM METHODS-------------------------------
	// Begin DOM method /setJqueryMap/
	setJqueryMap = function () {
		var $container = stateMap.$container;
		jqueryMap = { 
			$shelves 	: $container,
			$test		: $container.find( '.bsv-shelves-live'),
			$live		: $container.find( '.bsv-shelves-test'),
			$btn		: $('div').find( '#btn1' ),
			}
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

	};
	// End Public method /initModule/
	
	return { initModule : initModule };
	//----------------END PUBLIC METHODS------------------------------	
}());