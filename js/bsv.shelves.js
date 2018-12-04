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
			+		'<div class="bsv-shelves-test-header">'
			+			'<div class="bsv-shelves-test-header-text"></div>'
			+		'</div>'
			+		'<div class="bsv-shelves-test-width"></div>'
			+		'<div class="bsv-shelves-test-info"></div>'			
			+		'<div class="bsv-shelves-test-MARC" ></div>'
			+		'<div class="bsv-shelves-test-render"></div>'						
			+	'</div>',
			
			shelfParams : {
				x 			: 0,
				y			: 0,
				startX		: 8,
				totalWidth	: 996,
				thickness	: 18,
				bookSpace	: 292,
				shelfBox			: function (){
					var viewBox = 		this.x 
								+ " " + this.y 
								+ " " + this.totalWidth 
								+ " " + (this.thickness + this.bookSpace);
					var result = {
						viewBox : viewBox,
						"class"	: "shelfBox"
					};
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
            },
            comparison		: {
				div		 : ["$testw", "$testm", "$testm"],
				widthCol : ["widthCol", "marcWidthCol", "marcWidthCol"  ]
            },
            
            bookDrawDelay   : 20,			
		},
		
		stateMap  = { 
			$container 			: null,
			shelves_rendered	: false,
			fillBay_iteration	: 0,
            shelfCount			: 0,
            baysFilled			: 0,
            bookDrawDelay		: {},
            stats				: {
				totalBooks	: 0,
				totalShelves: 0,
				trueWidth 	: 0,
				estWidth	: 0,
				sconulWidth	: 0,
				update		: function (books, shelves, width, est){
					this.totalBooks += books;
					this.totalShelves = this.totalShelves + shelves;
					this.trueWidth = this.trueWidth + width;
					this.estWidth = this.estWidth + est;
				},
				reset		: function (){
					this.totalBooks 	= 0;
					this.totalShelves 	= 0;
					this.trueWidth 		= 0;
					this.estWidth 		= 0;
					this.sconulWidth	= 0;				
				},
				output		: function (){
					var result 	= "Books:      " + this.totalBooks + "\n"
								+ "Shelves:    " + this.totalShelves + "\n"
								+ "Total run:  " + this.trueWidth.toFixed() + "\n"
								+ "Est. run:   " + this.estWidth.toFixed() + "\n"
								+ "% diff:     " 
								+ percentageDifference(this.trueWidth, this.estWidth).toFixed(1)
								+ "%" + "\n\n"
 								+ "SCONUL run: " + this.sconulWidth.toFixed() + "\n"
 								+ "% diff:     "
								+ percentageDifference(this.trueWidth, this.sconulWidth).toFixed(1)
								+ "%";
					return result;
				},
				header		: function ( is_comparison ){
					var result 	= this.totalShelves + " shelves, "
								+ this.totalBooks 	+ " books, "
								+ mmToMetres(this.trueWidth);
					if (is_comparison) {
						var append 	= " (est. " + mmToMetres(this.estWidth)
									+ ", " + percentageDifference(this.trueWidth, this.estWidth).toFixed(1)
									+ "% diff.)";
						result += append;
					}
					return result;
				}				
			}
		},
		 
		jqueryMap =	{},
		
		percentageDifference, mmToMetres, setJqueryMap, makeShelf,
		makeSVG, makeInfoBox, makeBook, getWidthColAndDiv, fillBay, 
		onClickRender, setDivWidth, initModule;
	//----------------END MODULE SCOPE VARIABLES----------------------
	
	//----------------BEGIN UTILITY METHODS---------------------------
	
	percentageDifference = function(a,b) {
			var result = 100*((b-a)/a)
			return result;
	}
	
	mmToMetres = function ( input ) {
		if (input >= 999.5) {
			input = input/1000;
			return input.toFixed(2) + "m";
		}
		return input.toFixed() + "mm";
	};
		
	//----------------END UTILITY METHODS-----------------------------
	
	//----------------BEGIN DOM METHODS-------------------------------
	// Begin DOM method /setJqueryMap/
	setJqueryMap = function () {
		var $container = stateMap.$container;
		jqueryMap = { 
			$shelves 	: $container,
			$test		: $container.find( '.bsv-shelves-test'),
			$info		: $container.find( '.bsv-shelves-test-info'),
			$start		: $container.find( '.bsv-shell-start'),			
			$testw		: $container.find( '.bsv-shelves-test-width'),
			$testm		: $container.find( '.bsv-shelves-test-MARC'),
			$header		: $container.find( '.bsv-shelves-test-header-text'),
			$render		: $container.find( '.bsv-shelves-test-render')
			}
	};
	// End DOM method /setJqueryMap/	

	// Begin DOM method /makeShelf/ 
	makeShelf = function (bay, shelf, div){
		var books_id = "books_" + bay + "_" + (shelf);
		
		if (document.getElementById(books_id)) {return books_id;}
				
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

		var g_books = makeSVG("g", {id: books_id});     
		newShelf.appendChild(g_books);
	
		return books_id;
	};
	// End DOM method /makeShelf/ 


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

	// Add boolean is_comparison parameter: if false, return total mm instead of % diff
	makeInfoBox = function(svg_x, estWidth, bookCount, is_comparison){
		var infoBox = makeSVG("svg", configMap.shelfParams.statsBox()),
			sconul	= bookCount * 27.8,
			percentDiff, mmDiff, percentClass, percent, percentSconul,
			totalmm, booksTotal, shelfInfo, shelfTotal, estTotal;
		
		stateMap.stats.sconulWidth += sconul;	
		svg_x	= svg_x - configMap.shelfParams.startX;
		percentDiff = percentageDifference(svg_x,estWidth);
		percentDiff > 10 || percentDiff < -10 ? percentClass = "bad" : percentClass = "percent";
		percentDiff = percentDiff.toFixed(1) + "%";
		percentSconul = percentageDifference(svg_x,sconul).toFixed(1) + "%";

		percent = makeSVG("text", {
			x 				: "50%",
			y 				: "50%",
			"text-anchor"	: "middle",
			"class"			: percentClass
		});
		percent.innerHTML = percentDiff;

		totalmm = makeSVG("text", {
			x 				: "50%",
			y 				: "50%",
			"text-anchor"	: "middle",
			"class"			: "mm"
		});
		totalmm.innerHTML = mmToMetres(svg_x);

		booksTotal = makeSVG("text", {
			x 				: "50%",
			y 				: "62%",
			"text-anchor"	: "middle",
			"class"			: "booksTotal"
		});
		booksTotal.innerHTML = bookCount + " books";
		
		shelfInfo =  makeSVG("text", {
			x 				: "50%",
			y 				: "100%",
			"text-anchor"	: "middle",
			"class"			: "svgText"
		});
		is_comparison	?	shelfInfo.innerHTML = bookCount + " books | SCONUL: " 
							+ mmToMetres(sconul) + ", " + percentSconul
						:	shelfInfo.innerHTML = "SCONUL: " 
							+ mmToMetres(sconul) + " " + percentSconul + " diff."
		
		shelfTotal = makeSVG("text", {
			x 				: "50%",
			y 				: "62%",
			"text-anchor"	: "middle",
			"class"	: "svgText"
		});
		shelfTotal.innerHTML = "Measured: " + mmToMetres(svg_x);
				
		estTotal = makeSVG("text", {
			x 				: "50%",
			y 				: "72%",
			"text-anchor"	: "middle",
			"class"			: "svgText"
		});
		estTotal.innerHTML = "Estimated: " + mmToMetres(estWidth);	

		if (is_comparison) {
			infoBox.appendChild(percent);					
			infoBox.appendChild(shelfTotal);
			infoBox.appendChild(estTotal);	
		} else {
			infoBox.appendChild(totalmm);
			infoBox.appendChild(booksTotal);
		}
		infoBox.appendChild(shelfInfo);	
		stateMap.stats.update(bookCount, 1, svg_x, estWidth);		
		return infoBox;	
	};


	makeBook = function(dataRow, svg_x, shelf, headerRow, widthCol, is_title) {

		var	titleText 	= "",
			actualWidthCol	= bsv.data.getParam("widthCol"),
			heightCol	= bsv.data.getParam("heightCol"),
			is_comparison = bsv.data.getParam("is_comparison"),
			shelfHeight = configMap.shelfParams.bookSpace - 1,
			bookAttrs 	= {},
			delay		= stateMap.bookDrawDelay[shelf],
			actualWidth, percentDiff, g, nextBook, j, toolTip
			;

		actualWidth	= Number(dataRow[actualWidthCol]),

		bookAttrs.width  = Number(dataRow[widthCol]);
		bookAttrs.height = Number(dataRow[heightCol])*10;
		bookAttrs.x		 = svg_x;
		bookAttrs.y		 = shelfHeight - bookAttrs.height;		
		bookAttrs.width  > 32   ? bookAttrs["class"] =  "thick" : bookAttrs["class"] =  "thin";
		bookAttrs.height > 220  ? bookAttrs["class"] += " tall" : bookAttrs["class"] += " short";

	// *** COME BACK TO THIS. BRANCHING LOGIC IF COMPARISON. NEED TO OVERLAY BOOKS WITH
	// SEMI-TRANSPARANT RED MASK ON THIRD ITERATION.

		if (is_comparison) {
			if (stateMap.fillBay_iteration == 2) {		
				percentDiff = percentageDifference(actualWidth, bookAttrs.width);
				mmDiff = actualWidth - bookAttrs.width;
				if (percentDiff > 20) {
					bookAttrs["class"] = "badbook";
				} else if (percentDiff < -20) {
					bookAttrs["class"] = "badminus";
				} else {
					stateMap.bookDrawDelay[shelf] += configMap.bookDrawDelay;
					return bookAttrs.width;
				}
			}		
		}
		
		// Create a <g> element to hold each book and tooltip
		g = makeSVG("g");     

		// Create a <rect> element to draw book
		nextBook = makeSVG("rect", bookAttrs);
		g.appendChild(nextBook);

		// If not title splash, add metadata and delay		
		if (!is_title) {
			// Add a tooltip to hold row of data as text (labels from header row)	
			for (j = 0 ; j < headerRow.length; j++) {
				titleText += headerRow[j] + ": " + dataRow[j] + "\n";
			}
			toolTip = makeSVG("title");
			toolTip.innerHTML = titleText;
			g.appendChild(toolTip);

			// After a delay, add the book to the shelf
			function shelveBook() {
				shelf.appendChild(g);
			};
			setTimeout(shelveBook, delay);
			stateMap.bookDrawDelay[shelf] += configMap.bookDrawDelay;
		} else {
			shelf.appendChild(g);
		}
		return bookAttrs.width;
	};
// makeBook FUNCTION ENDS


	getWidthColAndDiv = function (params){
	// Determine whether (a) true data (b) estimated (c) comparison.
	// Returns widthCol and div values in an object,
	// accessed via thisBay.widthCol and thisBay.targetDiv.	

		var i		= stateMap.baysFilled,
			result	= {};
		
		targetDiv 	= configMap.comparison.div[i];
		widthCol	= configMap.comparison.widthCol[i];
		// (a) true data if there's no estWidth column
		if (!params.estWidth) {
			result.targetDiv = jqueryMap[targetDiv];
			result.widthCol  = params.widthCol;
			return result;
		} 
		// (b) estimated if there's a width column
		else if (params.estWidth && params.widthCol <= 0){
			result.targetDiv = jqueryMap[targetDiv];
			result.widthCol  = params.marcWidthCol;
			return result;
		}
		// (c) otherwise it must be a comparison
		else {
			result.targetDiv = jqueryMap[targetDiv];
			result.widthCol	 = params[widthCol];
			return result;
		}
	};
	
	fillBay = function (data, i, shelfCount, params, is_title){
	  	var svg_x       = configMap.shelfParams.startX,
			start_x     = configMap.shelfParams.startX,
			shelfSpace	= configMap.shelfParams.totalWidth,
			shelfIDs	= params["shelf_id"],
			shelfCol	= params["shelfCol"],
			bookCount	= 0,
			bay			= stateMap.baysFilled,
			estWidth	= 0,
			headers		= data[0],
			colCount	= headers.length-1,
			is_comparison = params["is_comparison"],
			targetDiv, widthCol, width, shelf, infoBox, percent, shelfTotal, estTotal,
			thisBay
		;

		thisBay = getWidthColAndDiv(params);
		is_title 	? targetDiv = $(".titleSVG") 
					: targetDiv = thisBay.targetDiv;
		
	// Start creating shelves and books
		shelfCount++;
		shelf = document.getElementById(makeShelf(bay, shelfCount, targetDiv));
		stateMap.bookDrawDelay[shelf] = configMap.bookDrawDelay;	
		
	// Loop over data file to create books
		while (i <= data.length-1) {
			width = makeBook(data[i], svg_x, shelf, headers, thisBay.widthCol, is_title);
	
			// Update x position for next book, with 1mm space between, and track estWidth
			svg_x = svg_x + width + 1;
			if (is_comparison) {estWidth = estWidth + Number(data[i][data[i].length - 1]) + 1;}
			bookCount++;
			
			// If no more data, log stats and return
			if (i == data.length-1) {
				if (stateMap.baysFilled === 0) {
					stateMap.baysFilled = 1;
					infoBox = makeInfoBox (svg_x, estWidth, bookCount, is_comparison);
					jqueryMap.$info.append(infoBox);
					jqueryMap.$header.text(stateMap.stats.header(is_comparison))
							 		 .css("background", "#F2F1EF");
//					console.log(stateMap.stats.output());
				};
				stateMap.fillBay_iteration++;
				return stateMap.shelves_rendered = true;						
			};
			i++;
			
			// If user has selected a shelf ID column, continue until it changes
			if (shelfIDs != null) {
				// Check if next book has a different shelf ID
				if (data[i][shelfCol] !== shelfIDs[shelfCount]){
					if (is_title) {return;}
					infoBox = makeInfoBox (svg_x, estWidth, bookCount, is_comparison);
					jqueryMap.$info.append(infoBox);		
					break;			
				}
			// Otherwise continue until shelf is full, then log stats and end loop
			} else if (svg_x + width > (shelfSpace - start_x)) {
				infoBox = makeInfoBox (svg_x, estWidth, bookCount, is_comparison);
				jqueryMap.$info.append(infoBox);
				break;
			}; 		
		} // End loop
		
		// Create and fill further shelf if there's still more data
		if (i < data.length) {
			return fillBay(data, i, shelfCount, params /*div, ***trueWidth****/);
		} 

	};	
// fillBay FUNCTION ENDS

	
	//----------------END DOM METHODS---------------------------------

	//----------------BEGIN EVENT HANDLERS----------------------------
	
	onClickRender = function ( event ) {
		if (stateMap.shelves_rendered === false) {
			var data = bsv.data.getData(),
				is_comparison = bsv.data.getParam("is_comparison"),
				iterations, i;
				
			is_comparison ? iterations = 3 : iterations = 1;
			for (i = 0 ; i < iterations ; i++) {			
				fillBay(data, 1, 0, bsv.data.getAllParams());
			}
			jqueryMap.$render
				.text('Clear shelves')
				.attr('title', 'Click to clear shelves')
				.removeClass('bsv-shelves-test-render')
				.addClass('bsv-shelves-test-clear');
			return false;
		} else {
			jqueryMap.$testw.empty();
			jqueryMap.$testm.empty();			
			jqueryMap.$info.empty();
			jqueryMap.$header.css("background", "#dfdcd1");
			jqueryMap.$render
				.text('Fill shelves')
				.attr('title', 'Click to render shelves with measured data')
				.removeClass('bsv-shelves-test-clear')
				.addClass('bsv-shelves-test-render');
			jqueryMap.$header
				.text('');
			stateMap.shelves_rendered = false;
			stateMap.baysFilled = 0;
			stateMap.fillBay_iteration = 0;			
			stateMap.stats.reset();
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

		jqueryMap.$render
			.text('Fill shelves')
			.attr('title', 'Click to render shelves with measured data')
			.click( onClickRender );
			

	};
	// End Public method /initModule/
	
	setDivWidth = function (is_comparison) {
		var divs		= [	".bsv-shelves-test-width", 
							".bsv-shelves-test-info", 
							".bsv-shelves-test-MARC"],
			comp_widths	= ["36vw", "13vw", "36vw"],
			comp_lefts 	= ["7vw", "44vw", "57.9vw"],
//				widths	= ["51.4vw", "18.6vw", "15vw"],
//				lefts 	= ["7vw", "59.4vw", "78.9vw"],
				widths	= ["44.8vw", "16.2vw", "9vw"],
				lefts 	= ["22vw", "67.8vw", "84.9vw"],


		 	i, div, targetDiv;
	 				
		for (i = 0 ; i < lefts.length ; i++){
			$class = divs[i];
			if (is_comparison) {
				$($class).width(comp_widths[i]);
				$($class).css("left", comp_lefts[i]);
			} else {
				$($class).width(widths[i]);
				$($class).css("left", lefts[i]);
			}
		}
		return true;
	};
	
	
	return { 
		initModule 	: initModule, 
		setDivWidth : setDivWidth,
		fillBay		: fillBay
		};
	//----------------END PUBLIC METHODS------------------------------	
}());