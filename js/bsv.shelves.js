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
				shelfBox			: function (){
					var viewBox = 		this.x 
								+ " " + this.y 
								+ " " + this.totalWidth 
								+ " " + (this.thickness + this.bookSpace);
					var result = {viewBox : viewBox};
					return result;
				},
				statsBox		: function (){
					var viewBox = 		this.x 
								+ " " + this.y 
								+ " " + ((36.1/100) * this.totalWidth) 
								+ " " + (this.thickness + this.bookSpace);
					var result = {
								viewBox : viewBox,
								"class"	: "statsBox"
								};
					return result;
				}
			}
						
		},
		
		stateMap  = { 
			$container 			: null,
			is_live_open		: false,
			shelves_rendered	: false,
			shelfCount			: 0,
			stats				: {
				totalBooks	: 0,
				totalShelves: 0,
				trueWidth 	: 0,
				estWidth	: 0,
				update		: function (books, shelves, width, est){
					this.totalBooks += books;
					this.totalShelves = this.totalShelves + shelves;
					this.trueWidth = this.trueWidth + width;
					this.estWidth = this.estWidth + est;
				},
				output		: function (){
					var result 	= "Books:     " + this.totalBooks + "\n"
								+ "Shelves:   " + this.totalShelves + "\n"
								+ "Total run: " + this.trueWidth.toFixed() + "\n"
								+ "Est. run:  " + this.estWidth.toFixed() + "\n"
								+ "% diff:    " 
								+ percentageDifference(this.trueWidth, this.estWidth).toFixed(1)
								+ "%";
					return result;
				}
			}
		},
		 
		jqueryMap =	{},
		
		percentageDifference, setJqueryMap, toggleTest, makeShelf,
		makeBook, makeSVG, makeInfoBox, fillBay, onClickToggle, 
		onClickRenderMeasured, onClickRenderEstimated, onClickRenderComparison, 
		initModule;
	//----------------END MODULE SCOPE VARIABLES----------------------
	
	//----------------BEGIN UTILITY METHODS---------------------------
	
	percentageDifference = function(a,b) {
			var result = 100*((b-a)/a)
			return result;
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
			$testm		: $container.find( '.bsv-shelves-test-MARC'),
			$live		: $container.find( '.bsv-shelves-live'),
			$livew		: $container.find( '.bsv-shelves-live-width'),
			$btn1		: $('div').find( '#btn1' ),
			$btn4		: $('div').find( '#btn4' ),
			$btn5		: $('div').find( '#btn5' ),
			$btn6		: $('div').find( '#btn6' ),
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
		var newShelf = makeSVG("svg", configMap.shelfParams.shelfBox());
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
	
	makeBook = function(dataRow, svg_x, shelf, headerRow, trueWidth){
	
		var	titleText 	= "",
			widthCol	= bsv.data.getParams("widthCol"),
			heightCol	= bsv.data.getParams("heightCol"),
			shelfHeight = configMap.shelfParams.bookSpace - 1,
			bookAttrs = {},
			g, nextBook, j, toolTip
			;

		trueWidth	?	bookAttrs.width  = Number(dataRow[widthCol])
					:   bookAttrs.width  = Number(dataRow[dataRow.length - 1]);
		bookAttrs.height = Number(dataRow[heightCol])*10;
		bookAttrs.x		 = svg_x;
		bookAttrs.y		 = shelfHeight - bookAttrs.height;		
		bookAttrs.width  > 32   ? bookAttrs["class"] =  "thick" : bookAttrs["class"] =  "thin";
		bookAttrs.height > 220  ? bookAttrs["class"] += " tall" : bookAttrs["class"] += " short";
//		bookAttrs.width  > 32   ? bookAttrs.fill =  "green" : bookAttrs.fill =  "orange";

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
	
	
	makeInfoBox = function(svg_x, estWidth, bookCount){
		var infoBox = makeSVG("svg", configMap.shelfParams.statsBox()),
			sconul	= bookCount * 27.8,
			percentDiff, percentClass, percent, percentSconul,
			shelfInfo, shelfTotal, estTotal;
			
		svg_x	= svg_x - configMap.shelfParams.startX;
		percentDiff = percentageDifference(svg_x,estWidth)
		percentDiff > 10 || percentDiff < -10 ? percentClass = "bad" : percentClass = "percent";
		percentDiff = percentDiff.toFixed(1) + "%";
		percentSconul = percentageDifference(svg_x,sconul).toFixed(1) + "%";

		percent = makeSVG("text", {
			x 		: "15%",
			y 		: "50%",
			class	: percentClass
		});
		percent.innerHTML = percentDiff;
		
		shelfInfo =  makeSVG("text", {
			x 		: "3%",
			y 		: "100%",
			class	: "svgText"
		});
		shelfInfo.innerHTML = bookCount + " books | SCONUL: " + sconul.toFixed() + "mm, " + percentSconul;
		
		shelfTotal = makeSVG("text", {
			x 		: "15%",
			y 		: "62%",
			class	: "svgText"
		});
		shelfTotal.innerHTML = "Measured: " + (svg_x).toFixed() + "mm";
				
		estTotal = makeSVG("text", {
			x 		: "15%",
			y 		: "72%",
			class	: "svgText"
		});
		estTotal.innerHTML = "Estimated: " + (estWidth).toFixed() + "mm";	

		infoBox.appendChild(percent);
		infoBox.appendChild(shelfInfo);
		infoBox.appendChild(shelfTotal);
		infoBox.appendChild(estTotal);	
		stateMap.stats.update(bookCount, 1, svg_x, estWidth);		
		return infoBox;	
	};
	

	fillBay = function (data, i, shelfCount, div, trueWidth){
	  	var svg_x       = configMap.shelfParams.startX,
			start_x     = configMap.shelfParams.startX,
			shelfSpace	= configMap.shelfParams.totalWidth,
			bookCount	= 0, 
			estWidth	= 0,
			headers		= data[0],
			colCount	= headers.length-1,
			width, shelf, infoBox, percent, shelfTotal, estTotal;
		  
		shelfCount += makeShelf(i, div);
		shelf = document.getElementById("books_" + i);
		
	  // loop over data file
		while (i <= data.length-1) {
			width = makeBook(data[i], svg_x, shelf, headers, trueWidth);
	
			// Update x position for next book, with 1mm space between, and track estWidth
			svg_x = svg_x + width + 1;
			estWidth = estWidth + Number(data[i][data[i].length - 1]) + 1;
	
			// If no more data, log stats and return
			if (i == data.length-1) {
				if (trueWidth) {
					infoBox = makeInfoBox (svg_x, estWidth, bookCount);
					jqueryMap.$info.append(infoBox);	
//					stateMap.stats.update(bookCount, 1, svg_x - start_x, estWidth);
					console.log(stateMap.stats.output());					
				}
				return stateMap.shelves_rendered = true;						
			};
			i++;
			bookCount++;
			
			// If shelf is full, log stats and end loop
			if (svg_x + width > (shelfSpace - start_x)) {
				if (trueWidth) {
					infoBox = makeInfoBox (svg_x, estWidth, bookCount);
					jqueryMap.$info.append(infoBox);

				}
				break;
			}; 
		}
		// Create and fill further shelf if there's still more data
		if (i < data.length) {
			return fillBay(data, i, shelfCount, div, trueWidth);
		} 

	};	
	
	//----------------END DOM METHODS---------------------------------

	//----------------BEGIN EVENT HANDLERS----------------------------
	onClickToggle = function ( event ) {
		toggleTest (stateMap.is_live_open);
		return false;
	};
	
	onClickRenderMeasured = function ( event ) {
		if (stateMap.shelves_rendered === false) {
			var data = bsv.data.getData();
			fillBay(data, 1, 0, jqueryMap.$testw);
			jqueryMap.$btn4
				.text('Clear')
				.attr('title', 'Click to clear shelves');				
			return false;
		} else {
			jqueryMap.$testw.empty();
			jqueryMap.$testm.empty();			
			jqueryMap.$info.empty();	
			jqueryMap.$btn4
				.text('Measured')
				.attr('title', 'Click to render shelves with measured data');
			jqueryMap.$btn5
				.text('Estimated')
				.attr('title', 'Click to render shelves with modelled data')				
			stateMap.shelves_rendered = false;
			return false;
		}		
	};
	
	onClickRenderEstimated = function (event) {
		if (stateMap.shelves_rendered === false) {
			var data = bsv.data.getData();
			fillBay(data, 1, 0, jqueryMap.$testm, false);
			jqueryMap.$btn5
				.text('Clear')
				.attr('title', 'Click to clear shelves');				
			return false;
		} else {
			jqueryMap.$testm.empty();
			jqueryMap.$testw.empty();
			jqueryMap.$info.empty();	
			jqueryMap.$btn5
				.text('Estimated')
				.attr('title', 'Click to render shelves with modelled data')
			jqueryMap.$btn4
				.text('Measured')
				.attr('title', 'Click to render shelves with measured data');
			stateMap.shelves_rendered = false;
			return false;
		}
	};
	
	onClickRenderComparison = function (event) {
		if (stateMap.shelves_rendered === false) {
			var data = bsv.data.getData();
			fillBay(data, 1, 0, jqueryMap.$testm, false);
			fillBay(data, 1, 0, jqueryMap.$testw, true);
			jqueryMap.$btn6
				.text('Clear')
				.attr('title', 'Click to clear shelves');				
			return false;
		} else {
			jqueryMap.$testm.empty();
			jqueryMap.$testw.empty();
			jqueryMap.$info.empty();	
			jqueryMap.$btn6
				.text('Compare')
				.attr('title', 'Click to compare measurements with modelled data')
			jqueryMap.$btn5
				.text('Estimated')
				.attr('title', 'Click to render shelves with modelled data')
			jqueryMap.$btn4
				.text('Measured')
				.attr('title', 'Click to render shelves with measured data');
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
			.text('Measured')
			.attr('title', 'Click to render shelves with measured data')
			.click( onClickRenderMeasured );
			
		jqueryMap.$btn5
			.text('Estimated')
			.attr('title', 'Click to render shelves with modelled data')
			.click( onClickRenderEstimated );

		jqueryMap.$btn6
			.text('Compare')
			.attr('title', 'Click to compare measurements with modelled data')
			.click( onClickRenderComparison );
			
		toggleTest(true);

	};
	// End Public method /initModule/
	
	return { initModule : initModule };
	//----------------END PUBLIC METHODS------------------------------	
}());