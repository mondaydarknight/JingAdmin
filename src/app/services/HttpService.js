(function() {
	'use strict';

	define([], function() {

		angular
			.module('JingAdmin')
			.factory('HttpService', HttpService)

		HttpService.$inject = ['$http', 'CONFIGURATION'];

		function HttpService($http, CONFIGURATION) {

			var service = {};

			service.fetchLocalConfiguration = function() {
				
			};

			service.get = function(operation, params = {}, isCache = false) {
				return $http({
					url: CONFIGURATION.SERVER_URL + operation,
					method: 'GET',
					params: params,
					paramSerializer: '$httpParamSerializerJQLike',
					cache: isCache 
				}).then(function(response) {
					if (isHttpStatusSuccess(response.status)) {
						return response.data;
					}
				});
				// return $http.get(CONFIGURATION.SERVER_URL + operation, {cache: isCache}).then(function(response) {
				// 	if (isHttpStatusSuccess(response.status)) {
				// 		return response.data;
				// 	}
				// });
			};

			service.post = function(operation, parameters) {
				return $http.post(CONFIGURATION.SERVER_URL + operation, parameters).then(function(response) {
					if (isHttpStatusSuccess(response.status)) {
						return response.data;
					}
				});
			};

			service.put = function(operation, parameters) {
				return $http.put(CONFIGURATION.SERVER_URL + operation, parameters).then(function(response) {
					if (isHttpStatusSuccess(response.status)) {
						return response.data;
					}
				});
			};

			service.delete = function(operation) {
				return $http.delete(CONFIGURATION.SERVER_URL + operation).then(function(response) {
					if (isHttpStatusSuccess(response.status)) {
						return response.data;
					}
				});
			};

			service.authenticateDefaultBasic = function() {
				$http.defaults.headers.common['Authorization'] = 'Basic';
			};

			return service;

			function isHttpStatusSuccess(status) {
				return status === 200 ? true : false;
			}

		}


	})

})()