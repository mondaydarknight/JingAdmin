(function() {
	'use strict';

	angular
		.module('JingAdmin')
		.factory('HttpRequestTracker', HttpRequestTracker)
		
	HttpRequestTracker.$inject = ['$http'];

	function HttpRequestTracker($http) {

		var service = {};

		service.hasPendingRequests = function() {
			return $http.pendingRequests.length > 0;
		}

		return service;
	}


})();