(function() {
	'use strict';

	define([], function() {
		angular.module('JingAdmin')
			.directive('orderDetailExpand', orderDetailExpand)

		function orderDetailExpand() {
			return {
				restrict: 'A',
				scope: {
					isOpen: '=orderDetailExpand'
				},
				link: function(scope, element, attrs) {
					element.hide();
					
					scope.$watch('isOpen', function(value) {
						return value ? element.slideDown() : element.slideUp();
					});
				}

			}
		}
	})

})();