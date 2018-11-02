/*
 * bsv.js
 * Root namespace module
 */
 
 /* global variables: $, bsv */
 
 var bsv = (function() {
 	var initModule = function ($container) {
		bsv.shell.initModule( $container );	
 	};
 
 	return { initModule : initModule };
 })();