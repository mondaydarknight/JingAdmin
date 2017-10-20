(function() {
	'use strict';

	define([], function() {

		angular
			.module('JingAdmin')
			.factory('AuthenticationService', AuthenticationService)

		AuthenticationService.$inject = ['$q', '$rootScope', '$state', '$timeout', 'CONFIGURATION', 'HttpService'];

		function AuthenticationService($q, $rootScope, $state, $timeout, CONFIGURATION, HttpService) {

			var service = {};

			service.user = {
				isAuthenticated: false,
				roles: null
			};

			service.detectUserAdmin = detectUserAdmin;
			service.login = login;
			service.logout = logout;
			service.setCredentials = setCredentials;
			service.clearCredentials = clearCredentials;

			function detectUserAdmin() {
				HttpService.get('isUserAdmin').then(function(response) {
					if (response.success) {
						service.user.isAuthenticated = true;
			            service.setCredentials({username : response.username});
			            fetchCurrentDirectory();
			            return;
					}

					$rootScope.$broadcast('redirectToLogin');
				});
			}

			function login(operation) {
				HttpService.post('login', operation).then(function(response) {
					$rootScope.$broadcast('loginStatusResponse', response);
				});
			}

			function logout() {
				HttpService.post('logout').then(function(response) {
					$rootScope.$broadcast('redirectToLogin');
				});
			}

			function setCredentials(userInformation) {
				angular.extend($rootScope.globals.user || {}, userInformation);
			}

			function clearCredentials() {
				HttpService.authenticateDefaultBasic();
			}

			function fetchCurrentDirectory() {
				$rootScope.globals.directories = [];
				$state.current.name.split('.').forEach(function(url, index) {
					if (index > 0) {
						$rootScope.globals.directories.push({root: url.charAt(0).toUpperCase() + url.substr(1), icon: CONFIGURATION.ICONS[url]}); 
					}
				});
			}

			return service;

		}

	})


})();


			