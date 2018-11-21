/*
 * bsv.shelves.js
 * Shelves module for Bookshelf Visualiser
 */
 
 /* global variables: $, bsv */

bsv.shelves = (function() {
	//----------------BEGIN MODULE SCOPE VARIABLES---------------------
	var 
		configMap = {
			main_html : String()
			+	'<div class="bsv-shelves-test">'
			+		'<div class="bsv-shelves-test-width"></div>'
			+		'<div class="bsv-shelves-test-info"></div>'			
			+		'<div class="bsv-shelves-test-MARC" ></div>'
			+	'</div>'
			+	'<div class="bsv-shelves-live">'
			+		'<div class="bsv-shelves-live-width"></div>'
			+	'</div>',
			
			shelfParams : {
				x 			: 0,
				y			: 0,
				startX		: 7,
				totalWidth	: 1000,
				thickness	: 18,
				bookSpace	: 292,
				viewBox			: function (){
					var viewBox = 		this.x 
								+ " " + this.y 
								+ " " + this.totalWidth 
								+ " " + (this.thickness + this.bookSpace);
					var result = {viewBox : viewBox};
					return result;
				}
			}
						
		},
		
		stateMap  = { 
			$container 			: null,
			is_live_open		: false,
			shelves_rendered	: false,
			shelfCount			: 0,
		},
		jqueryMap =	{},
		
		percentageDifference, setJqueryMap, toggleTest, makeShelf,
		makeBook, makeSVG, fillBay, onClickToggle, initModule;
	//----------------END MODULE SCOPE VARIABLES----------------------
	
	//----------------BEGIN UTILITY METHODS---------------------------
	
	percentageDifference = function(a,b) {
			var result = 100*((b-a)/a)
			return result.toFixed(1) + "%";
	}
		
	//----------------END UTILITY METHODS-----------------------------
	
	//----------------BEGIN DOM METHODS-------------------------------
	// Begin DOM method /setJqueryMap/
	setJqueryMap = function () {
		var $container = stateMap.$container;
		jqueryMap = { 
			$shelves 	: $container,
			$test		: $container.find( '.bsv-shelves-test'),
			$info		: $container.find( '.bsv-shelves-test-info'),
			$testw		: $container.find( '.bsv-shelves-test-width'),
			$live		: $container.find( '.bsv-shelves-live'),
			$livew		: $container.find( '.bsv-shelves-live-width'),
			$btn1		: $('div').find( '#btn1' ),
			$btn4		: $('div').find( '#btn4' ),
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
			jqueryMap.$btn1.text('Live').attr('title', 'Click to switch to live version');
			stateMap.is_live_open = false;
			return true;
		} 
		jqueryMap.$live.removeClass('bsv-x-clearfloat');
		jqueryMap.$test.addClass('bsv-x-clearfloat');	
		jqueryMap.$btn1.text('Test').attr('title', 'Click to switch to test suite');
		stateMap.is_live_open = true;
		return true;
	};
	// End DOM method /toggleTest/ 

	// Begin DOM method /makeShelf/ 
	makeShelf = function (id, div){
		var newShelf = makeSVG("svg", configMap.shelfParams.viewBox());
		div.append(newShelf);

		var g_shelf = makeSVG("g", {"class": "shelf"});     
		newShelf.appendChild(g_shelf);

		var r = makeSVG("rect", {
					x: 		"0",
					y: 		configMap.shelfParams.bookSpace,
					width: 	"100%",
					height:	configMap.shelfParams.thickness
				}
			);     
		g_shelf.appendChild(r);
	
		var books_id = "books_" + id;
		var g_books = makeSVG("g", {id: books_id});     
		newShelf.appendChild(g_books);
	
		return 1;
	};
	// End DOM method /makeShelf/ 
	
	makeBook = function(dataRow, svg_x, shelf, headerRow){
	
		var	titleText 	= "",
			widthCol	= bsv.data.getParams("widthCol"),
			heightCol	= bsv.data.getParams("heightCol"),
			shelfHeight = configMap.shelfParams.bookSpace - 1,
			bookAttrs = {},
			g, nextBook, j, toolTip
			;

		bookAttrs.width  = Number(dataRow[widthCol]);
		bookAttrs.height = Number(dataRow[heightCol])*10;
		bookAttrs.x		 = svg_x;
		bookAttrs.y		 = shelfHeight - bookAttrs.height;		
		bookAttrs.width  > 32   ? bookAttrs["class"] =  "thick" : bookAttrs["class"] =  "thin";
		bookAttrs.height > 220  ? bookAttrs["class"] += " tall" : bookAttrs["class"] += " short";  

		// Create a <g> element to hold each book and tooltip
		g = makeSVG("g");     
		shelf.appendChild(g);

		// Create a <rect> element to draw book
		nextBook = makeSVG("rect", bookAttrs);

		g.appendChild(nextBook);

		// Add a tooltip to hold row of data as text (labels from header row)	
		for (j = 0 ; j < headerRow.length; j++) {
			titleText += headerRow[j] + ": " + dataRow[j] + "\n";
		}
		toolTip = makeSVG("title");
		toolTip.innerHTML = titleText;
		g.appendChild(toolTip);

		return bookAttrs.width;
	};
	
	
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
	

	// Begin DOM method /fillBay/ 
	fillBay = function (data, i, shelfCount, cuml_length){
	  	var svg_x       = configMap.shelfParams.startX,
			start_x     = configMap.shelfParams.startX,		  
			headers		= data[0],
			colCount	= headers.length-1,
			marcWidth	= 0,
			width, shelf;
		  
		shelfCount += makeShelf(i, jqueryMap.$testw);
		shelf = document.getElementById("books_" + i);

	  // loop over data file
	  while (i <= data.length-1) {
	  	width = makeBook(data[i], svg_x, shelf, headers);
	  		
		// Update x position for next book, with 1mm space between
		svg_x = svg_x + width + 1; 
		
		// Increment figure modelled from MARC 300 
	    marcWidth  += Number(data[i][colCount])+1; 
	
		// If no more data, return
		if (i == data.length-1) {
		  	cuml_length += marcWidth - svg_x;		
			console.log(percentageDifference(svg_x - start_x,marcWidth));
			console.log("MARC width: " 			+ marcWidth.toFixed(1) 
						+ "\nActual width: "	+ ((svg_x - start_x).toFixed(1)) 
						+ "\nDifference: " 		+ cuml_length.toFixed(1));
			return stateMap.shelves_rendered = true;						
		};

		i++;
	
		// End current loop if the shelf is full
		if (svg_x + width > (configMap.shelfParams.totalWidth - start_x)) {
		  cuml_length += marcWidth - svg_x;
			console.log(percentageDifference(svg_x - start_x, marcWidth));
			console.log("marcWidth: " + marcWidth + "\nsvg_x: " + (svg_x - start_x));
		  break;
		}; 

	  }
		// Create and fill further shelf if there's still more data
	  if (i < data.length) {
		return fillBay(data, i, shelfCount, cuml_length);
	  } 

	};
	// End DOM method /fillBay/ 
	
	// refactor: remove tallies, and see if we can abstract a bit
	fillBayVersatile = function (data, i, shelfCount, div){
	  	var svg_x       = configMap.shelfParams.startX,
			start_x     = configMap.shelfParams.startX,		
			shelfSpace	= configMap.shelfParams.totalWidth,  
			headers		= data[0],
			colCount	= headers.length-1,
			width, shelf;
		  
		shelfCount += makeShelf(i, div);
		shelf = document.getElementById("books_" + i);

	  // loop over data file
	  while (i <= data.length-1) {
	  	width = makeBook(data[i], svg_x, shelf, headers);
	  		
		// Update x position for next book, with 1mm space between
		svg_x = svg_x + width + 1; 
			
		// If no more data, return
		if (i == data.length-1) {
			return stateMap.shelves_rendered = true;						
		};

		i++;
	
		// End current loop if the shelf is full
		if (svg_x + width > (shelfSpace - start_x)) {
		  break;
		}; 

	  }
		// Create and fill further shelf if there's still more data
	  if (i < data.length) {
		return fillBayVersatile(data, i, shelfCount, div);
	  } 

	};	
	
	//----------------END DOM METHODS---------------------------------

	//----------------BEGIN EVENT HANDLERS----------------------------
	onClickToggle = function ( event ) {
		toggleTest (stateMap.is_live_open);
		return false;
	};
	
	onClickRender = function ( event ) {
		if (stateMap.shelves_rendered === false) {
			var data = bsv.data.getData();
			fillBayVersatile(data, 1, 0, jqueryMap.$testw);
			jqueryMap.$btn4
				.text('Clear')
				.attr('title', 'Click to clear shelves');				
			return false;
		} else {
			jqueryMap.$testw.empty();
			jqueryMap.$btn4
				.text('Render')
				.attr('title', 'Click to render shelves with current dataset');
			stateMap.shelves_rendered = false;
			return false;
		}		
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
		jqueryMap.$btn1
			.text('Test')
			.attr('title', 'Click to switch to test suite')
			.click( onClickToggle );
		
		jqueryMap.$btn4
			.text('Render')
			.attr('title', 'Click to render shelves with current dataset')
			.click( onClickRender );
			
		toggleTest(true);

	};
	// End Public method /initModule/
	
	return { initModule : initModule };
	//----------------END PUBLIC METHODS------------------------------	
}());