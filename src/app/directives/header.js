(function() {
	'use strict';

	define([], function() {

		angular.module('JingAdmin').directive('headerNavbar', HeaderNavbar)

		function HeaderNavbar() {
			return {
				restrict: 'E',
				templateUrl: 'src/app/view/components/header-navbar.html',
				controller: 'HeaderController'
			}
		}

	})


})();