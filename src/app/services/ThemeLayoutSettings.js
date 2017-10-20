(function() {
	'use strict';

	angular
		.module('JingAdmin')
		.service('ThemeLayoutSettings', ThemeLayoutSettings);


	function ThemeLayoutSettings() {
		var isMobile = (/android|webos|ipad|ipod|blackberry|windows phone/).test(navigator.userAgent.toLowerCase());
		var mobileClass = isMobile ? 'mobile' : '';
		
		angular.element(document.body).addClass(mobileClass);

		return {
			mobile: isMobile
		}
	}


})();