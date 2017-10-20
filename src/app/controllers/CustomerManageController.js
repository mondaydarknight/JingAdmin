(function() {
	'use strict';

	angular.module('JingAdmin')
		.controller('CustomerManageController', CustomerManageController)
		.controller('CustomerDetailController', CustomerDetailController)

	CustomerManageController.$inject = ['$scope', '$state', 'HttpService'];
	CustomerDetailController.$inject = ['$scope', '$stateParams', 'HttpService'];

	function CustomerManageController($scope, $state, HttpService) {
		$scope.members = [];

		function searchCustomer() {
			HttpService.get('searchCustomer', {}, true).then(function(response) {
				if (response.success) {
					$scope.members = response.members;
				}
			});
		}

		searchCustomer();
	}


	function CustomerDetailController($scope, $stateParams, HttpService) {

		$scope.navigationCollapsed = true;

		function searchCustomerDetail() {
			HttpService.get('searchCustomerDetail', {memberId: $stateParams.memberId}, true).then(function(response) {
				if (response.success) {
					$scope.memberInfo = response.member;
				}
			});
		}

		searchCustomerDetail();
	}


})();