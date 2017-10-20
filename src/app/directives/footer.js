(function() {
	'use strict';

	define([], function() {

		angular.module('JingAdmin').directive('footerEnd', FooterEnd)

		FooterEnd.$inject = ['$location'];

		function FooterEnd($location) {
			return {
				restrict: 'EA',
				templateUrl: 'src/view/components/footer.end.html',
			}
		}

	});

})();