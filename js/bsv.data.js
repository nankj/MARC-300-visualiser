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
			+'<div class = "bsv-data-wrapper">'
			+	'<div class="bsv-data-close">X</div>'
			+	'<div class="bsv-data-intro">'
			+		'<h2>Choose a data source</h2>'
			+		'<p>You can use the built-in example data, or upload a CSV file below.'
			+		' Minimum requirement is a file with two columns: a unique item ID and'
			+		' a MARC 300 (subfield a). The current version doesn\'t handle'
			+		' the height (subfield c), but this is coming soon.</p>'
			+		'<p>Indicate which column holds the MARC 300 data. This is zero-indexed, so'
			+		' column A (first column) should be entered as 0.'
			+		' For more details see <a>[placeholder link]</a>.'
			+	'</div>'
			+	'<div>'
				+	'<fieldset class="bsv-data-params">'	
				+		'<legend>Set other parameters</legend>'
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
//				+				'<label for="bsv-data-params-enter"></label>'
//				+				'<button id="bsv-data-params-enter" class="button">Enter</button>'
				+			'</div>'
//				+		'</form>'
				+	'</fieldset>'
			+	'</div>'
			+	'<div>'
			+		'<fieldset class="bsv-data-data">'	
			+			'<legend>Upload CSV file</legend>'
//			+			'<form>'
			+				'<div>'
//			+					'<label for="bsv-data-data-csv"></label><br>'
			+					'<input type="file" name="File upload" id="bsv-data-data-csv" accept=".csv"/>'
			+				'</div>'
			+				'<p>Indicate which columns in your CSV file contain MARC 300 and other data.</p'
			+				'<div class="bsv-data-params-columns">'
			+					'<div id="marc-col">'
			+						'<label class="column-label" for="bsv-data-params-marcCol">MARC 300:</label>'
			+						'<input type="text" id="bsv-data-params-marcCol" value=""/>'
			+					'</div>'	
			+					'<div id="width-col">'
			+						'<label class="column-label" for="bsv-data-params-widthCol">Width:</label>'
			+						'<input type="text" id="bsv-data-params-widthCol" value="1"/>'
			+					'</div>'
			+					'<div id="height-col">'
			+						'<label class="column-label" for="bsv-data-params-heightCol">Height:</label>'
			+						'<input type="text" id="bsv-data-params-heightCol" value="2"/>'
			+					'</div>'
			+					'<div id="shelf-col">'
			+						'<label class="column-label" for="bsv-data-params-shelfCol">Shelf ID:</label>'
			+						'<input type="text" id="bsv-data-params-shelfCol" value="3"/>'
			+					'</div>'
			+				'</div>'
//			+			'</form>'
			+		'</fieldset>'
			+		'<fieldset class="bsv-data-example">'
			+			'<legend>Use example data</legend>'			
//			+				'<div>'
//			+					'<label for="bsv-data-data-enter">Example data</label>'
			+					'<div id="bsv-data-data-enter" class="button">Use</div>'
//			+				'</div>'
			+		'</fieldset>'	
			+	'</div>'
			+	'<div class="bsv-data-saveclose">Save and close</div>'
			+'</div>',

			average_page_count			:	'296 (est.)',

			exampleData2:  [["Binding (c or p)","Width (mm)","Height (cm)","Shelf","Clean barcode","Bib ID","300|c","300|a","260|c","Author","Title"],
							["c","31.6","25","2.101A","11098378","b10561432","24 cm.","xiii,322p ;","1987","0","A book of Wales : an anthology / selected by Meic Stephens."],
							["p","10.6","20","2.101A","16074311","b1364855x","20 cm.","128 p ;","1973","Williams, Gwyn.","Welsh poems, sixth century to 1600 / translated with an introduction and notes by Gwyn Williams."],
							["p","11.7","20","2.101A","16074310","b1364855x","20 cm.","128 p ;","1973","Williams, Gwyn.","Welsh poems, sixth century to 1600 / translated with an introduction and notes by Gwyn Williams."],
							["c","20.7","24","2.101A","11034604","b11326931","24 cm.","xx, 201p, (5) leaves of plates :","1980","Williams, Ifor, Sir, 1881-1965.","The beginnings of Welsh poetry : studies / by Sir Ifor Williams ; edited by Rachel Bromwich."],
							["c","22.9","23","2.101A","11068865","b11438782","22 cm.","222p,(1)leaf of plates :","c1982.","Bevan, Hugh, d. 1979.","Beirniadaeth lenyddol : erthyglau / gan Hugh Bevan ; wedi'u dethol a'u golygu gan Brynley F. Roberts."],
							["c","19","22","2.101A","16074306","b13648561","22 cm.","xvi, 156 p., [5] leaves of plates :","1954","Bevan, Hugh.","Morgan Llwyd y llenor / gan Hugh Bevan."],
							["p","16","22","2.101A","12189840","b15239184","0","ix,284p.","1997","Birt, Paul W.","Cerddi alltudiaeth : thema yn llenyddiaethau QuŽbec, Catalunya a Chymru."],
							["c","41.2","22","2.101A","16074353","b13648585","22 cm.","443 p., [6] leaves of plates :","1974","0","Y traddodiadd rhyddiaith yn yr Oesau Canol : (darlithiau Dewi Sant) / golygydd Geraint Bowen."],
							["c","36","23","2.101A","16074354","b13648573","22 cm.","391 p., 6 plates :","1970","0","Y Traddodiad rhyddiaith (darlithiau Rhydychen) / golygydd: Geraint Bowen."],
							["c","19","23","2.101A","11020528","b11157811","0","189p","1972","0","Ysgrifennu creadigol (Darlithiau Taliesin). Golygydd: Geraint Bowen."],
							["c","10.4","19","2.101A","16074352","b13648597","19 cm.","ix, 86 p., [8] leaves of plates :","1958","Bowen, D. J (David James), 1925-","Gruffudd Hiraethog a'i oes / gan D. J. Bowen."],
							["c","20","25","2.101A","12160266","b12985557","24 cm.","174p ;","1997","Breeze, Andrew.","Medieval Welsh literature / Andrew Breeze."],
							["c","36.1","23","2.101A","16074351","b13648603","23 cm.","xii, 390 p., [2] leaves of plates :","1978","0","Astudiaethau ar yr hengerdd = : Studies in old Welsh poetry / golygwyd gan Rachel Bromwich a R. Brinley Jones."],
							["c","18.8","23","2.101A","16074350","b15021427","22 cm.","167 p., [12] leaves of plates :","c1971.","0","Athrawon ac Annibynwyr : portreadau ac astudiaethau / gan J. Alwyn Charles ... [et al.] ; o dan olygyddiaeth Pennar Davies."],
							["p","16.6","22","2.101A","12172768","b14166872","22 cm.","xii,195p ;","1998","Davies, Ceri, 1946-","Welsh literature and the Classical tradition / Ceri Davies."],
							["p","29.6","27","2.101A","11057420","b10253129","0","0","0","EDEL, D.","HELDEN AUF FREIERSFUSSEN."],
							["c","14.7","22","2.101A","16074349","b13648615","22 cm.","[11], 85 p :","1976","Edwards, Hywel Teifi.","Yr Eisteddfod : cyfrol ddathlu wythganmlwyddiant yr Eisteddfod, 1176-1976 / [gan] Hywel Teifi Edwards."],
							["c","26.6","23","2.101A","16074347","b13648627","22 cm.","xvi, 280 p., 4 plates :","1967","Evans, Trebor Lloyd.","Lewis Edwards : ei fywyd a'i waith."],
							["c","8.1","22","2.101A","11068595","b10266811","0","0","1982","Davies, P.","Cymru yn llenyddiaeth Cymru."],
							["p","9.3","22","2.101A","16074348","b1365746x","21 cm.","110 p ;","1976","Edwards, J. M.","Y crefftwyr ac ysgrifau eraill."],
							["p","15.2","22","2.101A","11031269","b12444443","21 cm.","xvi,230p ;","(1979).","Eisteddfod Genedlaethol Frenhinol Cymru (1979 : Caernarfon a'r Cylch)","Cyfansoddiadau a beirniadaethau. Caernarfon a'r cylch / golygydd T.M. Bassett."],
							["c","14.2","25","2.101A","12001654","b10684311","25 cm.","93p :","1986","Evans, D. Simon (Daniel Simon), 1921-","Medieval religious literature / D. Simon Evans."],
							["c","7.9","22","2.101A","11068461","b10683951","21 cm.","20p ;","1982","Evans, D. Simon (Daniel Simon), 1921-","Llafar a llyfr yn yr hen gyfnod : darlith goffa G.J. Williams : traddodwyd yng Ngholeg y Brifysgol, Caerdydd ar 20 Tachwedd 1980 / gan D. Simon Evans."],
							["c","11.4","21","2.101A","16074346","b13648639","21 cm.","69 p ;","1968","Foster, Idris Llewelyn, Sir, 1911-1984.","Twf fr Eisteddfod : tair darlith, gan Helen Ramage, Melville Richards, Frank Price Jones / wedi eu golygugan Idris Foster."],
							["p","7","19","2.101A","11030759","b10828898","19 cm.","67p ;","1979","Gibbard, Noel.","Elusen i'r enaid : arweiniad i weithiau'r Piwritaniaid Cymreig, 1630-1689 / (gan) Noel Gibbard."],
							["c","26.6","23","2.101A","12084585","b11709728","23 cm.","viii,336 p ;","1975","Goetinck, Glenys.","Peredur : a study of Welsh tradition in the Grail legends / by Glenys Goetinck."],
							["c","26.9","23","2.101A","11046204","b1001021x","0","0","0","GRIFFITHS, M. E.","EARLY VATICINATION IN WELSH."],
							["p","11.2","22","2.101A","12058340","b1136578x","21 cm.","156p ;","1991","Gruffydd, W. J. (William John), 1881-1954.","Yr Hen Ganrif : beirniadaeth Lenyddol W. J. Gruffydd / golygdd Bobi Jones."],
							["p","6.8","25","2.101A","12029080","b10787008","24 cm.","78p :","1989","0","Llenyddiaeth y Cymry : cyflwyniad darluniadol. Cyf. 2, O tua 1530 i tua 1880 / gan R. Geraint Gruffydd."],
							["c","18.9","19","2.101A","16074356","b15078905","19 cm.","xiii, 166 p ;","1951","Hughes, Garfield H (Garfield Hopkin)","Rhagymadroddion, 1547-1659 / golygwyd gan Garfield H. Hughes."],
							["p","7.6","21","2.101A","16074355","b13648664","21 cm.","129 p ;","1977","0","Cwmwl o dystion / golygydd E. Wyn James."],
							["c","33.3","22","2.101A","11076980","b11872159","22 cm.","400p,(8)p of plates :","1979","0","A guide to Welsh literature / edited by A.O.H. Jarman and Gwilym Rees Hughes. Vol.2."],
							["c","32.6","23","2.101A","16074370","b13648676","23 cm.","v :","-1976","0","A guide to Welsh literature / edited by A. O. H. Jarman and Gwilym Rees Hughes."],
							["p","20.5","22","2.101A","12102451","b12020035","0","0","1992","0","A guide to Welsh literature / edited by A.O.H. Jarman and Gwilym R ees Hughes. Vol.1."],
							["p","19.4","22","2.101A","12189848","b15239573","22 cm.","viii,375p ;","1997","0","A guide to Welsh literature. Volume II, 1282-c.1550 / edited by A. O. H. Jarman and Gwilym Rees Hughes."],
							["c","30.2","25","2.101A","12323222","b18600815","24cm.","xvii, 491p. ;","2005","Johnston, Dafydd, 1955-","Lln yr uchelwyr : hanes beirniadol llenyddiaeth Gymraeg 1300-1525 / Dafydd Johnston."],
							["p","8.7","19","2.101A","12150215","b12106574","23 cm.","145p :","1994","Johnston, Dafydd, 1955-","The literature of Wales / Dafydd Johnston."],
							["p","10.6","19","2.101A","12156854","b12106574","23 cm.","145p :","1994","Johnston, Dafydd, 1955-","The literature of Wales / Dafydd Johnston."],
							["p","9.5","19","2.101A","12150214","b12106574","23 cm.","145p :","1994","Johnston, Dafydd, 1955-","The literature of Wales / Dafydd Johnston."],
							["p","8.9","19","2.101A","12173158","b14166732","19 cm.","x,143p :","1998","Johnston, Dafydd, 1955-","Llenyddiaeth Cymru : llyfr poced / Dafydd Johnston."],
							["c","8.3","19","2.101A","16074367","b13648688","19 cm.","20 p ;","1966","Jenkins, Dafydd, 1911-","Y stori fer Gymraeg."],
							["c","8.9","19","2.101A","16074357","b13648706","19 cm.","40 p ;","1963","Jones, Bobi, 1929-","Guto'r Glyn a'i gyfnod / gan Bobi Jones."],
							["c","12","19","2.101A","16074364","b1364872x","19 cm.","119 p ;","1957","Morris-Jones, Huw, 1912-","Y gelfyddyd lenyddol yng Nghymru."],
							["c","33.6","23","2.101A","16074366","b13648731","23 cm.","329 p., plate :","1977","Jones, John Gwilym.","Swyddogaeth beirniadaeth ac ysgrifau eraill / [gan] John Gwilym Jones."],
							["c","12.2","23","2.101A","16180884","b21390368","23cm.","86p. ;","1977","Jones, John Gwilym.","Crefft y llenor / John Gwilym Jones."],
							["c","30.2","25","2.101A","12323222","b18600815","24cm.","xvii, 491p. ;","2005","Johnston, Dafydd, 1955-","Lln yr uchelwyr : hanes beirniadol llenyddiaeth Gymraeg 1300-1525 / Dafydd Johnston."],
							["c","19","22","2.101A","16074306","b13648561","22 cm.","xvi, 156 p., [5] leaves of plates :","1954","Bevan, Hugh.","Morgan Llwyd y llenor / gan Hugh Bevan."],
							["p","6.8","25","2.101A","12029080","b10787008","24 cm.","78p :","1989","0","Llenyddiaeth y Cymry : cyflwyniad darluniadol. Cyf. 2, O tua 1530 i tua 1880 / gan R. Geraint Gruffydd."],
							["p","16","22","2.101A","12189840","b15239184","0","ix,284p.","1997","Birt, Paul W.","Cerddi alltudiaeth : thema yn llenyddiaethau QuŽbec, Catalunya a Chymru."],
							["c","41.2","22","2.101A","16074353","b13648585","22 cm.","443 p., [6] leaves of plates :","1974","0","Y traddodiadd rhyddiaith yn yr Oesau Canol : (darlithiau Dewi Sant) / golygydd Geraint Bowen."],
							["c","37.1","25","2.31B","11006467","b11037088","24 cm.","xiii,615p :","1971","0","American democracy."],
							["c","50","24","2.31B","16051798","b13273735","25 cm.","xxx, 1024 p :","[1959]","Carr, Robert Kenneth, 1908-","American democracy in theory and practice : National, State, and local government / [by] Robert K. Carr [and others]."],
							["c","25.2","24","2.31B","12169932","b13593262","24 cm.","x,245p ;","1998","0","Liberal democracy and its critics : perspectives in contemporary political thought / edited by April Carter and Geoffrey Stokes."],
							["p","24.1","23","2.31B","12258732","b16444607","24 cm.","x, 307 p. ;","2002","0","Democratic theory today : challenges for the 21st century / edited by April Carter and Geoffrey Stokes."],
							["c","37.6","24","2.31B","16051797","b13273747","23 cm.","xiv, 389 p ;","[1966]","Christophersen, Jens Andreas, 1925-","The meaning of democracy as used in European ideologies from the French to the Russian revolution. An historical study in political language / by Jens A. Christophersen."],
							["c","18.1","23","2.31B","12006871","b10387493","22 cm.","xi,211p ;","1986","Carter, L. B.","The quiet Athenian / L.B. Carter."],
							["c","28.7","22","2.31B","16129832","b11754710","21 cm.","x,310p :","1957","Downs, Anthony.","An economic theory of democracy / Anthony Downs."],
							["p","15","23","2.31B","12394446","b21463980","23 cm.","x, 229 pages ;","c2011.","Cheneval, Francis.","The government of the peoples : on the idea and principles of multilateral democracy / Francis Cheneval."],
							["p","16.1","23","2.31B","12299589","b17526243","23cm.","xiv, 202p. :","2007","Cheibub, JosŽ Ant™nio.","Presidentialism, parliamentarism, and democracy / Jose Antonio Cheibub."],
							["p","22.6","20","2.31B","12297424","b16859297","20cm.","311p. ;","2007","Chomsky, Noam.","Failed states : the abuse of power and the assault on democracy / Noam Chomsky."],
							["p","30.8","24","2.31B","12390819","b21422692","23 cm.","vii, 427 p. ;","2002","0","Materializing democracy : toward a revitalized cultural politics / Russ Castronovo and Dana D. Nelson, editors."],
							["c","27.3","22","2.31B","12220672","b15881702","23 cm.","viii,280p. ;","1998","Chryssochoou, Dimitris N., 1970-","Democracy in the European Union / Dimitris N. Chryssochoou."],
							["c","28","22","2.31B","12188910","b14890744","22 cm.","x, 310p ;","1996","Christiano, Thomas.","The rule of the many : fundamental issues in democractic theory / Thomas Christiano."],
							["c","18.3","25","2.31B","12323740","b18682716","25cm.","viii, 216p. ;","c2002.","0","Historical injustice and democratic transition in eastern Asia and northern Europe : ghosts at the table of democracy / edited by Kenneth Christie and Robert Cribb."],
							["p","17.9","24","2.31B","12335310","b18805322","24 cm.","305 p. ;","2010","Christiano, Thomas.","The constitution of equality : democratic authority and its limits / Thomas Christiano."],
							["c","27","24","2.31B","12120700","b12338199","24 cm.","xiv,267p ;","1995","0","Associations and democracy / edited by Joshua Cohen and Joel Rogers ; with contributions by Paul Q. Hirst...[et al.] ; edited by Erik Olin Wright."],
							["c","20.3","25","2.31B","16051796","b13273759","25 cm.","xix, 197 p ;","1976","0","Prospects for constitutional democracy : essays in honor of R. Taylor Cole / edited by John H. Hallowell."],
							["c","11.4","22","2.31B","16129842","b13273760","21 cm.","92 p ;","1943","Commager, Henry Steele, 1902-1998","Majority rule and minority rights / by Henry Steele Commager."],
							["p","15.1","23","2.31B","12370100","b21029453","23 cm.","225 pages :","2016","0","Bridging the gap? : opportunities and constraints of the European Citizens' Initiative / Maximilian Conrad, Annette Knaut, Katrin Bšttger (eds.)."],
							["c","19.8","23","2.31B","12172383","b13924187","24 cm.","xxx, 243 p. :","c1995.","Connolly, William E.","The ethos of pluralization / William E. Connolly."],
							["p","22.8","24","2.31B","12240188","b1582259x","24 cm.","xii, 353p ;","2000","0","American democracy promotion : impulses, strategies, and impacts / edited by Michael Cox, G. John Ikenberry and Takashi Inoguchi."],
							["p","5.8","21","2.31B","12236490","b16105527","21 cm.","iv,73p ;","2000","Crouch, Colin, 1944-","Coping with post-democracy / Colin Crouch."],
							["p","13.4","20","2.31B","12261596","b16423173","19 cm.","xi, 135 p. ;","2004","Crouch, Colin, 1944-","Post-democracy / Colin Crouch."],
							["p","20.6","24","2.31B","12241500","b16153789","24 cm.","[vii], 248p. :","2002","Cunningham, Frank, 1940-","Theories of democracy : a critical introduction / Frank Cunningham."],
							["c","33.7","24","2.31B","10002874","b12192375","24 cm.","xix, 471p ;","1967","Dahl, Robert A. (Robert Alan), 1915-","Pluralist democracy in the United States : conflict and consent."],
							["c","36.7","24","2.31B","12029415","b10449747","25 cm.","viii, 397 p. ;","1989","Dahl, Robert A. (Robert Alan), 1915-","Democracy and its critics / Robert A. Dahl."],
							["c","24.9","22","2.31B","11093341","b11596703","22 cm.","xi,229p ;","1982","Dahl, Robert A. (Robert Alan), 1915-","Dilemmas of pluralist democracy : autonomy vs. control / Robert A. Dahl."],
							["c","22.5","24","2.31B","11046087","b11098429","24 cm.","xi,148p :","1974","Dahl, Robert A. (Robert Alan), 1915-","Size and democracy / (by) Robert A. Dahl and Edward R. Tufte."],
							["c","22.8","23","2.31B","11098018","b10876893","23 cm.","286p ;","c1986.","Dahl, Robert A. (Robert Alan), 1915-","Democracy, liberty and equality / Robert A. Dahl."],
							["c","15.3","21","2.31B","10030852","b12201121","21 cm.","155p :","(1956).","Dahl, Robert A. (Robert Alan), 1915-","A preface to democratic theory / Robert A. Dahl."],
							["c","18.9","22","2.31B","11001915","b12201121","21 cm.","155p :","(1956).","Dahl, Robert A. (Robert Alan), 1915-","A preface to democratic theory / Robert A. Dahl."],
							["c","25.2","22","2.31B","11060442","b11596703","22 cm.","xi,229p ;","1982","Dahl, Robert A. (Robert Alan), 1915-","Dilemmas of pluralist democracy : autonomy vs. control / Robert A. Dahl."],
							["c","18","21","2.31B","16051794","b13324494","21 cm.","171 p ;","1970","Dahl, Robert A. (Robert Alan), 1915-","After the revolution : authority in a good society / by Robert A. Dahl."],
							["c","33.2","24","2.31B","11045582","b10097545","24 cm.","xxii, 453 p :","(1972).","Dahl, Robert A. (Robert Alan), 1915-","Democracy in the United States : promise and performance / (by) Robert A. Dahl."],
							["c","38.4","25","2.31B","12048880","b10449747","25 cm.","viii, 397 p. ;","1989","Dahl, Robert A. (Robert Alan), 1915-","Democracy and its critics / Robert A. Dahl."],
							["c","23.5","21","2.31B","11030287","b12212921","21 cm.","ix,257p :","1971","Dahl, Robert A. (Robert Alan), 1915-","Polyarchy : participation and opposition / by Robert A. Dahl."],
							["p","15.1","24","2.31B","12321902","b18671354","23cm.","ix, 230p. :","2007","Dalton, Russell J.","Democratic challenges, democratic choices : the erosion of political support in advanced industrial democracies / Russell J. Dalton."],
							["c","16.1","20","2.31B","16051830","b13273772","22 cm.","xvi p., 1 ., 140 p :","[1945]","Huszar, George Bernard de, 1919-","Practical applications of democracy / [by] George B. de Huszar."],
							["p","20.3","23","2.31B","12340061","b19485141","23 cm.","xi, 224 p. :","2013","Della Porta, Donatella, 1956-","Can democracy be saved? : participation, deliberation and social movements / Donatella della Porta."],
							["c","28.9","24","2.31B","12138933","b12673109","24 cm.","373 p. ;","1996","0","Democracy and difference : contesting the boundaries of the political / edited by Seyla Benhabib."],
							["c","8","23","2.17B","11039260","b10749706","23 cm.","(4),39p :","(1979).","National Book League.","University library expenditure, 1971-1977 : results of a six-year survey / (National Book League)."],
							["c","17.5","23","2.17B","16006663","b13158405","23 cm.","ix, 149 p :","1970","Neal, Kenneth William.","British university libraries / by K. W. Neal."],
							["c","15.7","23","2.17B","11039494","b10830972","23 cm.","vi,138p ;","1978","Neal, Kenneth William.","British university libraries / by K.W. Neal."],
							["p","13.1","24","2.17B","12280047","b1667344x","24cm.","202p., [4]p. of col. plates :","2005","0","Friends of the Princeton University Library : the lure of the Library : the Friends at 75 / [Gretchen M. Oberfranc, editor]."],
							["c","21.3","22","2.17B","11028985","b10457562","22 cm.","xx,187,(1)p ;","1979","Osburn, Charles B.","Academic research and library resources : changing patterns in America / (by) Charles B. Osburn."],
							["c","6.1","22","2.17B","16006661","b13158417","22 cm.","vi, 75 p :","1973","Parsons, C. J.","Library use in further education / [by] C. J. Parsons."],
							["p","16.9","23","2.17B","12325030","b18598882","24 cm.","213 p. ;","2010","Peters, Diane E.","International students and academic libraries : a survey of issues and annotated bibliography / Diane E. Peters."],
							["c","17.5","24","2.17B","12104030","b12035142","24 cm.","viii,152p :","1992","0","Information management and organizational change in higher education : the impact on academic libraries / edited by Gary M. Pitkin."],
							["c","21.1","24","2.17B","12206721","b13158429","24 cm.","x, 205 p :","1977","0","Academic libraries by the year 2000 : essays honoring Jerrold Orne / edited by Herbert Poole."],
							["p","8","29","2.17B","12353215","b20857500","28 cm","103 pages ;","2014","0","International survey of academic library data curation practices."],
							["p","5.4","29","2.17B","12344034","b19901598","28 cm","62 pages ;","2013","0","International survey of academic library data curation practices."],
							["p","7.2","29","2.17B","12360570","b20944524","28 cm.","99 p. ;","2015","0","Survey of academic library efforts to enhance faculty cooperation with open access / [Primary Research Group]."],
							["p","6.8","29","2.17B","12382953","b21270119","28 cm.","78 p.;","2017","Primary Research Group","International survey of research university leadership: views on supporting Open Access scholarly & educational materials / [Primary Research Group]."],
							["p","6.1","29","2.17B","12376875","b21066243","28 cm.","74 p. ;","2016","Primary Research Group.","International survey of research university faculty : use of the institutional digital repositories / [Primary Research Group]."],
							["p","24.2","29","2.17B","12371194","b20972507","29 cm.","387 p. ;","2016","Primary Research Group","Academic librarian use of Google and its apps & features / [Primary Research Group staff]"],
							["p","15.9","23","2.17B","12160765","b12998576","23 cm.","xi,289p :","1997","0","Restructuring academic libraries : organizational development in the wake of technological change / edited by Charles A. Schwartz."],
							["c","32.7","27","2.17B","11024679","b10846554","","","0","REYNOLDS, M.","READER IN THE ACADEMIC LIBRARY."],
							["c","32.7","27","2.17B","16006689","b10846554","","","0","REYNOLDS, M.","READER IN THE ACADEMIC LIBRARY."],
							["c","42.9","27","2.17B","16006688","b13158430","27 cm.","ix, 454 p :","1971","Rogers, Rutherford D.","University library administration / [by] Rutherford D. Rogers [and] David C. Weber."],
							["c","15.2","23","2.17B","16006687","b13158454","22 cm.","166 p ;","1973","Sable, Martin Howard.","International and area studies librarianship : case studies / by Martin H. Sable."],
							["c","21.9","24","2.17B","11005393","b10065532","","","0","SAUNDERS, W.","UNI. AND RESEARCH LIBRARY STUDIES."],
							["c","20.5","23","2.17B","16006686","b13158466","23 cm.","216 p ;","1963","Sheehan, Helen Beebe, 1904-","The small college library."],
							["c","27.6","24","2.17B","11085540","b10816471","24 cm.","xxii,308p ;","c1981.","Shiflett, Orvin Lee.","Origins of American academic librarianship / by Orvin Lee Shiflett."],
							["p","22.3","22","2.17B","16006685","b13158478","23 cm.","3 p. ., ix-xi, 290 p ;","1934","Shores, Louis, 1904-","Origins of the American college library, 1638-1800 / [by] Louis Shores."],
							["c","23.5","25","2.17B","12292390","b1685911x","25 cm.","xii, 267 p. :","c2006.","Simon, Theresia.","Die Positionierung einer UniversitŠts- und Hochschulbibliothek in der Wissensgesellschaft : eine bibliothekspolitische und strategische Betrachtung / Theresia Simon."],
							["c","22","23","2.17B","11005384","b12965066","23 cm.","viii,185p ;","1965","Smith, D. L.","College library administration : in colleges of technology, art, commerce and further education / by D.L. Smith and E.G. Baxter."],
							["p","24.9","24","2.17B","12382654","b21330049","23 cm.","x, 307 p. ;","2016","0","Open access and the future of scholarly communication : policy and infrastructure / edited by Kevin L. Smith, Katherine A. Dickson."],
							["c","17.2","22","2.17B","12047026","b10460834","22 cm.","119p ;","1990","Smith, Eldred.","The librarian, the scholar, and the future of the research library / Eldred Smith."],
							["c","18.7","23","2.17B","11050820","b10750241","23 cm.","xv,229p :","1981","0","University librarianship / edited by John F. Stirling."],
							["p","14","21","2.17B","11071159","b11162041","21 cm.","227p :","1979","0","Studies on the organisational structure and services in national and university libraries in the Federal Republic of Germany and in the United Kingdom : papers presented at a joint meeting of British and German librarians at the University of Bristol in September 1978."],
							["c","19.7","23","2.17B","12050944","b11162624","23 cm.","viii,182p ;","1991","Thompson, James, 1932-","Redirection in academic library management / James Thompson."],
							["c","16.7","23","2.17B","16067209","b11161930","23 cm.","160p,leaf of plate,(8)p of plates :","(1979).","Thompson, James, 1932-","An introduction to university library administration / (by) James Thompson."],
							["c","20.4","23","2.17B","11095089","b1116234x","22 cm.","265p ;","1987","Thompson, James, 1932-","An introduction to university library administration / James Thompson, Reg Carr."],
							["c","27.2","23","2.17B","11041549","b1116203x","0","(318)p","1980","0","University library history : an international review / edited by James Thompson."],
							["c","39.8","24","2.17B","12048169","b11116535","24 cm.","xxiii,520p ;","c1990.","Veaner, Allen B., 1929-","Academic librarianship in a transformational age : program, politics, and personnel / Allen B. Veaner."],
							["c","23.7","22","2.17B","16066867","b13513023","21 cm.","xiv, 221 p :","1975","Veit, Fritz, 1907-","The community college library / Fritz Veit."],
							["c","21.8","25","2.17B","12283707","b16685726","24 cm.","xvii, 278 p. :","2007","Webb, Jo.","Providing effective library services for research / Jo Webb, Pat Gannon-Leary and Moira Bent."],
							["p","16.6","23","2.17B","12369863","b21031599","23 cm.","xiv, 229 p :","2016","0","Laying the foundation : digital humanities in academic libraries / edited by John W. White and Heather Gilbert."],
							["c","47","24","2.17B","16066886","b13513047","0","xiii, 641 p :","1956","Wilson, Louis Round, 1876-","The university library; the organization, administration, and functions of academic libraries / by Louis Round Wilson and Maurice F. Tauber."],
							["c","16.6","23","2.27A","11088375","b10373627","23 cm.","138p ;","1985","Norman, Edward R.","Roman Catholicism in England : from the Elizabethan settlement to the Second Vatican Council / Edward Norman."],
							["c","36.1","25","2.27A","10024838","b12395432","24 cm.","(7),507p ;","1976","Norman, Edward R.","Church and society in England, 1770-1970 : a historical study / by E.R. Norman."],
							["c","35.1","25","2.27A","10024839","b12395432","24 cm.","(7),507p ;","1976","Norman, Edward R.","Church and society in England, 1770-1970 : a historical study / by E.R. Norman."],
							["p","14.6","24","2.27A","12385515","b21393801","24 cm.","240 pages ;","2016","Norman, Edward R.","Anti-Catholicism in Victorian England / E. R. Norman."],
							["c","28.7","23","2.27A","11074961","b1039221x","23 cm.","vi,399p ;","1984","Norman, Edward R.","The English Catholic Church in the nineteenth century / Edward Norman."],
							["c","35.7","23","2.27A","11023781","b12630408","23 cm.","423 p ;","1962","Nuttall, Geoffrey Fillingham, 1911-","From uniformity to unity, 1662-1962 / Edited by Geoffrey F. Nuttall and Owen Chadwick."],
							["c","30.1","23","2.27A","16173238","b13222107","23 cm.","303 p ;","1976","0","Continuity and change : personnel and administration of the Church of England, 1500-1642 / edited by Rosemary O'Day & Felicity Heal."],
							["c","21.4","23","2.27A","11055394","b12679665","23 cm.","283p :","1981","0","Princes and paupers in the English church 1500-1800 / edited by Rosemary O'Day and Felicity Heal."],
							["c","17.8","23","2.27A","12020605","b10535779","22 cm.","224p ;","1986","O'Day, Rosemary.","The debate on the English Reformation / Rosemary O'Day."],
							["p","29.7","22","2.27A","12350615","b20659751","22 cm.","xv, 348 pages ;","2014","O'Day, Rosemary.","The debate on the English Reformation / Rosemary O'Day."],
							["c","24.6","25","2.27A","12149235","b12814441","24 cm.","xvi,224p :","1996","Ogier, D. M. (Darryl Mark), 1962-","Reformation and society in Guernsey / D. M. Ogier."],
							["c","25.8","25","2.27A","12062452","b11423201","24 cm.","xv,328p :","1992","Ortenberg, Veronica.","The English church and the continent in the tenth and eleventh centuries : cultural, spiritual and artistic exchanges / Veronica Ortenberg."],
							["c","24.4","24","2.27A","12147577","b12812353","23 cm.","365p :","1996","0","St. Oswald of Worcester : life and influence / edited by Nicholas Brooks andCatherine Cubitt."],
							["p","26","24","2.27A","12137066","b12738694","25 cm.","298p, (16)p of plates :","c1995.","0","Oswald : Northumbrian king to European saint / edited by Claire Stancliffe & Eric Cambridge."],
							["c","13.7","26","2.27A","16173237","b13222119","26 cm.","xii,89p :","(1971).","Church of England. Diocese of Ely.","Ely records : a handlist of the records of the Bishop and Archdeacon of Ely / by Dorothy M. Owen."],
							["c","21.2","26","2.27A","16068929","b1356738x","26 cm.","[7], 213 p :","1968","Lambeth Palace Library.","A catalogue of Lambeth manuscripts 889 to 901 (carte antique et miscellanŽe): charters in Lambeth Palace Library / by Dorothy M. Owen."],
							["c","24.6","22","2.27A","12040302","b10992716","22 cm.","xi,2981p ;","1955","Pantin, W. A.","The English Church in the fourteenth century : based on the Birkbeck lectures, 1948 / by W.A. Pantin."],
							["c","32.4","24","2.27A","12000980","b1165613x","24 cm.","xiii,506p ;","1986","Parry, J. P. (Jonathan Philip), 1957-","Democracy and religion : Gladstone and the Liberal Party, 1867-1875 / J.P. Parry."],
							["c","30.9","26","2.27A","11044950","b1160945x","26 cm.","(1),288p ;","1975","Parkhurst, John, 1511-1575.","The Letter Book of John Parkhurst, Bishop of Norwich, compiled during the years 1571-5 / edited by R.A. Houlbrooke."],
							["c","34.5","23","2.27A","16035114","b13222144","23 cm.","xiii, 322 p ;","1967","Parmiter, Geoffrey de Clinton.","The king's great matter : a study of Anglo-Papal relations 1527-1534 / [by] Geoffrey de C. Parmiter."],
							["c","32.7","23","2.27A","16068930","b13567408","","372 p","1966","Derry, Warren.","Dr. Parr: a portrait of the Whig Dr. Johnson."],
							["c","37","23","2.27A","16173239","b13222156","23 cm.","362 p ;","1952","Douie, Decima L (Decima Langworthy), 1901-1980.","Archbishop Pecham."],
							["c","18.9","20","2.27A","16068931","b1356741x","20 cm.","viii, 261 p ;","1945","Green, Vivian Hubert Howard.","Bishop Reginald Pecock : a study in ecclesiastical history and thought / by V. H. H. Green."],
							["c","22.9","23","2.27A","11040087","b1268806x","23 cm.","240p ;","1977","Perman, David.","Change and the churches : an anatomy of religion in Britain / (by) David Perman."],
							["c","42.2","26","2.27A","16173240","b13222168","25 cm.","[iv], 459 p ;","1933","Perroy, Edouard, 1901-1974.","L'Angleterre et le grand schisme d'Occident : ƒtude sur la politique rŽligieuse de L'Angleterre sous Richard II (1378-1399)."],
							["p","8.3","26","2.27A","12053752","b11346334","25 cm.","ix,119p :","1991","Collinson, Patrick, 1929-","Andrew Perne : quatercentenary studies / Patrick Collinson, David McKitterick, Elisabeth Leedham-Green ; edited by David McKitterick."],
							["c","31.6","23","2.27A","12045545","b10392713","23 cm.","ix,329p :","1986","Pettegree, Andrew.","Foreign Protestant communities in sixteenth-century London / Andrew Pettegree."],
							["c","23.9","22","2.27A","16173241","b1322217x","22 cm.","224 p ;","1973","Pill, David H.","The English Reformation, 1529-58 / [by] David H. Pill."],
							["c","40.6","22","2.27A","16173230","b1322220x","23 cm.","x, 461 p :","1958","Porter, Harry Culverwell.","Reformation and reaction in Tudor Cambridge."],
							["c","16.8","23","2.27A","16173231","b13222193","23 cm.","146 p :","1971","Porter, Henry Maurice.","The Celtic church in Somerset : with a chapter on North Devon / by H. M. Porter."],
							["c","56.6","28","2.69A","16151598","b14544118","28 x 22 cm.","8 v ;","-1939","0","TrŸbners deutsches Wšrterbuch : im Auftrag der Arbeitsgemeinschaft fŸr deutsche Wortforschung herausgegeben / von Alfred Goetze."],
							["c","46.4","28","2.69A","16151599","b14544118","28 x 22 cm.","8 v ;","-1939","0","TrŸbners deutsches Wšrterbuch : im Auftrag der Arbeitsgemeinschaft fŸr deutsche Wortforschung herausgegeben / von Alfred Goetze."],
							["c","80.5","28","2.69A","12189149","b15071716","28 cm.","1451p ;","2000","Wahrig, Gerhard.","Deutsches Wšrterbuch : mit einem Lexikon der Deutschen Sprachlehre / Gerhard Wahrig."],
							["c","81.5","28","2.69A","12184686","b15071716","28 cm.","1451p ;","2000","Wahrig, Gerhard.","Deutsches Wšrterbuch : mit einem Lexikon der Deutschen Sprachlehre / Gerhard Wahrig."],
							["c","80.5","28","2.69A","12189148","b15071716","28 cm.","1451p ;","2000","Wahrig, Gerhard.","Deutsches Wšrterbuch : mit einem Lexikon der Deutschen Sprachlehre / Gerhard Wahrig."],
							["c","83.4","24","2.69A","12108021","b12104206","24 cm.","1824p ;","1994","Wahrig, Gerhard.","Deutsches Wšrterbuch : mit einem 'Lexikon der deutschen Sprachlehre / [von] Gerhard Wahrig."],
							["c","48.6","27","2.69A","16151601","b1454412x","","2 v","1968","Weigand, Friedrich Ludwig Karl, 1804-1878.","Deutsches Wšrterbuch / [Von] Fr. L. K. Weigand."],
							["c","52.5","27","2.69A","16151602","b1454412x","","2 v","1968","Weigand, Friedrich Ludwig Karl, 1804-1878.","Deutsches Wšrterbuch / [Von] Fr. L. K. Weigand."],
							["c","82.2","31","2.69A","12267854","b15433808","32 cm.","1051p :","1999","0","Wšrterbuch der Redensarten zu der von Karl Kraus 1899 bis 1936 herausgegebenen Zeitschrift Die Fackel / herausgegeben von Werner Welzig."],
							["c","51","25","2.69A","16151609","b14544179","26 cm.","v ;","-1970","0","Wšrterbuch der deutschen Gegenwartssprache / Hrsg. von  Ruth Klappenbach und Wolfgang Steinitz."],
							["c","47.3","25","2.69A","16151611","b14544179","26 cm.","v ;","-1970","0","Wšrterbuch der deutschen Gegenwartssprache / Hrsg. von  Ruth Klappenbach und Wolfgang Steinitz."],
							["c","47.3","25","2.69A","16151613","b14544179","26 cm.","v ;","-1970","0","Wšrterbuch der deutschen Gegenwartssprache / Hrsg. von  Ruth Klappenbach und Wolfgang Steinitz."],
							["c","46.5","25","2.69A","12258626","b14544179","26 cm.","v ;","-1970","0","Wšrterbuch der deutschen Gegenwartssprache / Hrsg. von  Ruth Klappenbach und Wolfgang Steinitz."],
							["c","35","25","2.69A","16151615","b14544179","26 cm.","v ;","-1970","0","Wšrterbuch der deutschen Gegenwartssprache / Hrsg. von  Ruth Klappenbach und Wolfgang Steinitz."],
							["c","56.2","25","2.69A","16151600","b14569553","25 cm.","6 v ;","1964-77.","0","Wšrterbuch deutschen Gegenwartssprache / Herausgegeben von Ruth Klappenbach und Wolfgang Steinitz."]],
		},
		stateMap  = { 
			$container 			: null,
			shelf_id_exists 	: false
		},
		paramMap  = {},
		bookData  = [],
		jqueryMap =	{},
		
		setJqueryMap, setParamMap, initModule,
		browserSupportFileUpload, uploadCSV, setExampleData, numberRange,
		convertRoman, sumIntegers, marc300ToWidth, mapShelfIDs, getData, getParam,
		getAllParams, onChangeUploadCSV, onClickParamBtn, onClickClose, onClickExampleData;
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
		paramMap.marcCol 	= 7;
		paramMap.widthCol	= 1;
		paramMap.heightCol	= 2;
		paramMap.shelfCol	= 3;
 		paramMap.ppmm		=	jqueryMap.$ppmm.val();
		bookData = marc300ToWidth(configMap.exampleData2, paramMap.marcCol);	
		paramMap.shelf_id = mapShelfIDs(bookData);	
		paramMap.is_comparison = false;
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
	
		// return immediately if no MARC col
		if (col <= 0) {
			setParam("estWidth", false);
			return array;
		}
		
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

		firstTime 	?	totalCols = totalCols + 1
					:	totalCols;
		array[0][totalCols]="MARC Width";	
		setParam("marcWidthCol", totalCols);
		setParam("estWidth", true);

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
			$parambtn	:	$container.find( '.bsv-data-saveclose'),
			$datacsv	:	$container.find( '#bsv-data-data-csv'),
			$dataenter	:	$container.find( '#bsv-data-data-enter'),
		};
	};
	// End DOM method /setJqueryMap/	


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
			shelfCol	:	jqueryMap.$shelfCol.val()
		};
		if (bookData[0]) {
			bookData = marc300ToWidth(bookData, paramMap.marcCol);			
			if (paramMap.shelfCol > 0) {
				stateMap.shelf_id_exists = true; 
				paramMap.shelf_id = mapShelfIDs(bookData);
				} else { 
				stateMap.shelf_id_exists = false; 
				paramMap.shelf_id = null;
			};
			
			if (paramMap.widthCol > 0 && paramMap.estWidth) {
				paramMap.is_comparison = true;
				bsv.shelves.setDivWidth(true);
				} else {
				paramMap.is_comparison = false;
				bsv.shelves.setDivWidth(false);
			}
		}
	};
	// End DOM method / setParamMap /

	//----------------END DOM METHODS---------------------------------

	//----------------BEGIN EVENT HANDLERS----------------------------
	onClickClose = function (event) {
		setParamMap();
		jqueryMap.$data.addClass('bsv-x-clearfloat');
		return false;
	};
	
	onClickParamBtn = function (event) {
		setParamMap();
		onClickClose();
		return false;
	};
	
	onChangeUploadCSV = function (event) {
		setParamMap();
		uploadCSV(event);
		jqueryMap.$dataenter.text("Use");
		return false;
	};
	
	onClickExampleData = function (event) {
		setExampleData();
		jqueryMap.$dataenter.background("red");
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
		
		// Load up parameters and example dataset
		setParamMap();
		setExampleData();
		
		// Bind event handlers
		jqueryMap.$closer
			.attr('title', 'Save and close')
			.click( onClickClose );
			
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
	
	getParam	= function (param) {
		return paramMap[param];
	};
	
	setParam = function (param, val)	{
		paramMap[param] = val;
	};
	
	getAllParams = function (){
		return paramMap;
	};

	
	return { 
		initModule 		: initModule,
		getData			: getData,
		getParam		: getParam,
		setParam		: setParam,
		getAllParams	: getAllParams
		};
	//----------------END PUBLIC METHODS------------------------------	
}());
