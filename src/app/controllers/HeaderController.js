(function() {
	'use strict';

	define([], function() {

		angular.module('JingAdmin').controller('HeaderController', HeaderController)

		HeaderController.$inject = ['$scope', '$state', 'AuthenticationService'];

		function HeaderController($scope, $state, AuthenticationService) {
			$scope.originalLocation = '#/admin/home/lobby';
			$scope.isAuthenticated = AuthenticationService.user.isAuthenticated;

			$scope.logout = function($event) {
				$event.preventDefault();
				if (AuthenticationService.user.isAuthenticated) {
					return AuthenticationService.logout();
				}	
			};

			$scope.$on('redirectToLogin', function() {
				redirectToLogin();
			});

			$scope.$watch(function() {
				return AuthenticationService.user.isAuthenticated;
			}, function() {
				$scope.isAuthenticated = AuthenticationService.user.isAuthenticated;
			});

			function redirectToLogin() {
				AuthenticationService.user.isAuthenticated = false;
				$state.go('login');
			}

		}
	})

})();