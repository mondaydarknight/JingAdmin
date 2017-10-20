(function() {
	'use strict';

	define([], function() {

		angular
			.module('JingAdmin')
			.factory('FlashService', FlashService);

		FlashService.$inject = ['$rootScope'];

		function FlashService($rootScope) {
			var service = {};

			var success = function(message, keepAfterLocationChange) {
				$rootScope.flash = {
					message: message,
					type: 'success',
					keepAfterLocationChange: keepAfterLocationChange
				};
			};

			var error = function(message, keepAfterLocationChange) {
				$rootScope.flash = {
					message: message,
					type: 'error',
					keepAfterLocationChange: keepAfterLocationChange
				};
			};

			var clearFlashMessage = function() {
				delete $rootScope.flash;
				// if (flash) {
				// 	if (!flash.keepAfterLocationChange) {
				// 		delete $rootScope.flash;
				// 	} else {
				// 		flash.keepAfterLocationChange = false;
				// 	}
				// }
			};


			(function() {
				$rootScope.$on('$locationChangeStart', function() {
					clearFlashMessage();
				});
			})();

			service.success = success;
			service.error = error;
			service.clearFlashMessage = clearFlashMessage;

			return service;
		}

	})	


})();
