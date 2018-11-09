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
			+	'</div>'			
		},
		stateMap  = { 
			$container 			: null,
			is_live_open		: false,
			shelves_rendered	: false,
			shelfCount			: 0,
		},
		jqueryMap =	{},
		
		percentageDifference, setJqueryMap, toggleTest, makeShelf, fillShelf,
		onClickToggle, initModule;
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
	function makeShelf(id){
		var newShelf = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		var div = jqueryMap.$testw;
		newShelf.setAttributeNS(null, "viewBox", "0 0 1000 310");
		div.append(newShelf);

		var g_shelf = document.createElementNS("http://www.w3.org/2000/svg", "g");     
		g_shelf.setAttributeNS(null, "class", "shelf");
		newShelf.appendChild(g_shelf);

		var r = document.createElementNS("http://www.w3.org/2000/svg", "rect");     
		r.setAttributeNS(null, "x", "0");
		r.setAttributeNS(null, "y", "292");
		r.setAttributeNS(null, "width", "100%");
		r.setAttributeNS(null, "height", "18");	
		g_shelf.appendChild(r);
	
		var books_id = "books_" + id;
		var g_books = document.createElementNS("http://www.w3.org/2000/svg", "g");     
		g_books.setAttributeNS(null, "id", books_id);
		newShelf.appendChild(g_books);
	
		return 1;
	};
	// End DOM method /makeShelf/ 

	// Begin DOM method /fillShelf/ 
	function fillShelf(data, i, shelfCount, cuml_length){
  
	  shelfCount += makeShelf(i /*, targetDivId*/);

	  var shelf       	= document.getElementById("books_" + i),
		  shelfHeight 	= bsv.data.getParams("shelfHeight"),
		  svg_x       	= 7,
		  headers		= data[0],
		  colCount		= headers.length-1,
		  widthCol	 	= bsv.data.getParams("widthCol"),
		  heightCol		= bsv.data.getParams("heightCol"),
		  marcWidth		= 0,
		  width, height, svg_y, nextBook, size, 
		  g, j, title, titleText;

	  // loop over data file
	  while (i <= data.length-1) {
	  	titleText = "";
		width  = Number(data[i][widthCol]);
		height = Number(data[i][heightCol])*10;
		svg_y  = shelfHeight - height;
		width > 32 ? size = "thick" : size = "thin";
		height > 220 ? size += " tall" : size += " short";       

		// Create a <g> element to hold each book and tooltip
		g = document.createElementNS("http://www.w3.org/2000/svg", "g");     
		shelf.appendChild(g);
	
		// Build <rect> element to draw book
		nextBook = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		nextBook.setAttributeNS(null, "x", svg_x);
		nextBook.setAttributeNS(null, "y", svg_y);
		nextBook.setAttributeNS(null, "width", width);
		nextBook.setAttributeNS(null, "height", height);
		nextBook.setAttributeNS(null, "class", size);    
		g.appendChild(nextBook);

		// Add a tooltip to hold row of data as text (labels from header row)	
		for (j = 0 ; j < headers.length; j++) {
			titleText += headers[j] + ": " + data[i][j] + "\n";
		}
		title = document.createElementNS("http://www.w3.org/2000/svg", "title");
		title.innerHTML = titleText;
		g.appendChild(title);
	
		// Update x position for next book, with 1mm space between
		svg_x = svg_x + width + 1;
		// Increment figure modelled from MARC 300 
	    marcWidth  += Number(data[i][colCount])+1; 
	
		// If no more data, return
		if (i == data.length-1) {
		
			console.log(percentageDifference(svg_x - 7,marcWidth));
			console.log("marcWidth: " 					+ marcWidth 
						+ "\nsvg_x: "					+ (svg_x - 7) 
						+ "\nTotal length difference: " + cuml_length);
			return stateMap.shelves_rendered = true;
/*			return header.innerHTML = shelfCount 
									+ " shelves | " 
									+ (cuml_length/1000).toFixed(2) 
									+ "m total run";
*/								
		};

		i++;
	
		// End current loop if the shelf is full
		if (svg_x + width > 993) {
		  cuml_length += marcWidth - svg_x;
			console.log(percentageDifference(svg_x - 7,marcWidth));
			console.log("marcWidth: " + marcWidth + "\nsvg_x: " + (svg_x - 7));
		  break;
		}; 

	  }
		// Create and fill further shelf if there's still more data
	  if (i < data.length) {
		return fillShelf(data, i, shelfCount, cuml_length);
	  } 

	};
	// End DOM method /fillShelf/ 
	
	//----------------END DOM METHODS---------------------------------

	//----------------BEGIN EVENT HANDLERS----------------------------
	onClickToggle = function ( event ) {
		toggleTest (stateMap.is_live_open);
		return false;
	};
	
	onClickRender = function ( event ) {
		if (stateMap.shelves_rendered === false) {
			var data = bsv.data.getData();
			fillShelf(data, 1, 0, 0);
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