(function() {
	'use strict';

	define([], function() {

		angular.module('JingAdmin').directive('alertFlash', AlertFlash)

		function AlertFlash() {
			return {
				restrict: 'E',
				templateUrl: 'src/app/view/components/alert.html',
				link: function(scope, element) {
					
				}
			}
		}

	});


})();