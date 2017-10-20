(function() {
	'use strict';

	angular.module('JingAdmin')
		.controller('OrderManageController', OrderManageController)
		.controller('ModalCheckController', ModalCheckController)


	OrderManageController.$inject = ['$scope', '$filter', '$location', '$route', '$rootScope', '$uibModal', '$document', 'HttpService', 'toastr'];
	ModalCheckController.$inject = ['$scope', '$uibModalInstance', 'mode', 'orders'];

	function OrderManageController($scope, $filter, $location, $route, $rootScope, $uibModal, $document, HttpService, toastr) {
		$scope.isAllChecked = false;
		$scope.temporaryChecked = [];
		$scope.currentSort = 'username';
		$scope.sortReverse = false;
		$scope.orderStatus = {' ' : '待出貨', 'C' : '訂單完成', 'D' : '訂單取消'};
		$scope.pageItemsLimit = 10; 
		$scope.currentPage = 0;

		$scope.search = function(operation, params) {
			HttpService.get(operation, params, true).then(function(response) {
				_searchCallback(response);
			});
		};

		$scope.sort = function($event, sortItem) {
			$event.preventDefault();

			$scope.currentSort === sortItem ? $scope.sortReverse = !$scope.sortReverse : $scope.currentSort = sortItem;
		};

		$scope.loadOrderPages = function() {
			$scope.pageOrders = [];
			
			angular.forEach($scope.orders, function(order, index) {
				angular.extend(order, {isExpanded: false, isCheckboxSelected: false});
				
				(index % $scope.pageItemsLimit === 0) 
					? $scope.pageOrders[Math.floor(index / $scope.pageItemsLimit)] = [order]
					: $scope.pageOrders[Math.floor(index / $scope.pageItemsLimit)].push(order);
			});
		};

		$scope.toggleAllCheckbox = function() {
			
			if (isPageAllCheckboxSelected()) {
				$scope.temporaryChecked = [];
				$scope.isAllChecked = false;
				angular.forEach($scope.pageOrders[$scope.currentPage], function(order, index) {
					order.isCheckboxSelected = false;
				})
				return;
			}

			$scope.temporaryChecked = [];
			$scope.isAllChecked = true;
			angular.forEach($scope.pageOrders[$scope.currentPage], function(order, index) {
				$scope.temporaryChecked.push(index);
				order.isCheckboxSelected = true;
			})
			
		};

		$scope.clickCheckbox = function(order, $index) {
			order.isCheckboxSelected = !order.isCheckboxSelected
			var checkboxIndex = $scope.temporaryChecked.indexOf($index);

			checkboxIndex > -1 ? $scope.temporaryChecked.splice(checkboxIndex, 1) : $scope.temporaryChecked.push($index);
			return isPageAllCheckboxSelected() ? $scope.isAllChecked = true : $scope.isAllChecked = false;
		};

		$scope.setPage = function($index) {
			$scope.currentPage = $index;
		};

		$scope.modalClick = function(mode) {
			$scope.mode = mode;
			var modalInstance = $uibModal.open({
				templateUrl: 'modal-check-order.html',
				controller: 'ModalCheckController',
				resolve: {
					mode: function() {
						return $scope.mode;
					},
					orders: function() {
						return $scope.orders;
					}
				}
			});

			modalInstance.result.then(function(options) {
				HttpService.put('manageOrder', {command: options.mode.operation, transactionIds: options.transactionIds}).then(function(response) {
					if (response.success) {
						angular.forEach(options.orderIds, function(id) {
							$scope.orders[id].status = response.status;
						})
						$scope.loadOrderPages();
						toastr.success(options.mode.name + '成功!');
					}
				})
			}, function() {
				
			});
		};

		function searchTodayOrder() {
			$scope.search('searchTodayOrder');
		}

		function _searchCallback(response) {
			if (response.success) {
				$scope.orders = response.orders;
				return $scope.loadOrderPages();
			}

			$scope.orders = [];
		}

		function findCurrentCategory() {
			if (Object.keys($route.current.params).length === 0) {
				$scope.currentCategoryIndex = 0;
			}
		}

		function isPageAllCheckboxSelected() {
			return $scope.temporaryChecked.length === $scope.pageOrders[$scope.currentPage].length ? true : false;
		}

		searchTodayOrder();
	}

	function ModalCheckController($scope, $uibModalInstance, mode, orders, pageOrders) {
		
		var modalMode = {
			complete: {
				name: '完成訂單',
				text: '是否完成顧客訂單?',
				operation: 'completeOrder'
			},
			cancel: {
				name: '取消訂單',
				text: '是否取消顧客訂單?',
				operation: 'cancelOrder'
			}
		};

		$scope.confirm = function() {
			var transactionIds = [];
			var orderIds = [];

			angular.forEach($scope.orders, function(order, index) {
				transactionIds.push(order.transactionId);
				orderIds.push(order.index);
			});

			$uibModalInstance.close({mode: $scope.mode, transactionIds: transactionIds, orderIds: orderIds});
		};

		$scope.cancel = function() {
			$uibModalInstance.dismiss();
		};

		(function checkOrderClicked() {
			$scope.orders = [];
			$scope.mode = modalMode[mode];
			
			angular.forEach(orders, function(order, index) {
				(order.isCheckboxSelected && order.status === ' ') ? $scope.orders.push(angular.extend(order, {index: index})) : false;
			});

		})();
		
	}


})();