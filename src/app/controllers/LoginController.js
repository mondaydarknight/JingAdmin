(function() {
	'use strict';

	define([], function() {

		angular.module('JingAdmin').controller('LoginController', LoginController)

		LoginController.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'AuthenticationService', 'FlashService'];

		function LoginController($scope, $state, $rootScope, $timeout, AuthenticationService, FlashService) {

	        $scope.user = {email: '', password: ''};
	        $scope.login = login;

	        var loginStatusResponse = function(loggedIn) {
	            if (loggedIn.success) {
	                // AuthenticationService.user.isAuthenticated = true;
	                AuthenticationService.setCredentials({username : loggedIn.username});
	                FlashService.success('Login Success');
	                $timeout(function() {redirectToHome();}, 800);
	            } else {
	                FlashService.error(loggedIn.message);
	                $scope.dataLoading = false;
	            }
	        };

	        $scope.$on('loginStatusResponse', function(event, loggedIn) {
	            loginStatusResponse(loggedIn);
	        });

	        function login($event) {
	        	$event.preventDefault();
	            $scope.dataLoading = true;
	            AuthenticationService.login($scope.user);
	        }

	        function redirectToHome() {
	            $state.go('admin.home.lobby');
	        }
	    }
	});

})();