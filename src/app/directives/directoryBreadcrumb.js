(function() {
	'use strict';


	angular.module('JingAdmin')
		.directive('directoryBreadcrumb', directoryBreadcrumb)

	directoryBreadcrumb.$inject = ['CONFIGURATION'];

	function directoryBreadcrumb(CONFIGURATION) {
		return {
			templateUrl: CONFIGURATION.VIEW_URL + 'components/directory-breadcrumb.html'
		}
	}

})();