(function() {
	'use strict';

	define([], function() {
		angular.module('JingAdmin')
			.directive('advancedOption', advancedOption)
			.controller('AdvancedOptionController', AdvancedOptionController)
			.directive('advancedOptionContent', advancedOptionContent)
			.controller('AdvancedOptionContentController', AdvancedOptionContentController)

		AdvancedOptionController.$inject = ['$scope', 'CONFIGURATION'];
		AdvancedOptionContentController.$inject = ['$scope', '$filter', '$timeout', 'FlashService'];

		function advancedOption() {
			return {
				template: 	'<div class="btn-group" uib-dropdown>'+
          					'<a href class="btn btn-info btn-xs" aria-selected="false" uib-dropdown-toggle>進階搜尋</a>'+
          					'<ul class="dropdown-menu" role="menu" aria-labelledby="advancedOptions" uib-dropdown-menu>'+
          					'<li ng-repeat="option in advancedOptions">'+
          					'<a href ng-click="launchAdvance($event, option.url)">{{::option.name}}</a>'+
          					'</li>'+
          					'</ul>'+
          					'</div>',
          		controller: AdvancedOptionController
			}
		}

		function AdvancedOptionController($scope, CONFIGURATION) {
			$scope.advancedOptions = 
				[
					{category: 'customer', name: '顧客查詢', url: 'order/advanced.customer.html'}, 
					{category: 'date', name: '日期查詢', url: 'order/advanced.date.html'}
				];
			$scope.launchAdvance = function($event, url) {
				$event.preventDefault();
				$scope.advancedURL = CONFIGURATION.VIEW_URL + url; 
			};
		}

		function advancedOptionContent() {
			return {
				restrict: 'EA',
				template: '<div ng-include="advancedURL"></div>',
				controller: 'AdvancedOptionContentController'
			}
		} 

		function AdvancedOptionContentController($scope, $filter, $timeout, FlashService) {

			$scope.advanced = {isAdvanced: false, isLoading: false, dateFrom: null, dateEnd: null};
		
			$scope.advanced.dateConfiguration = {
				startView: 'day',
				configureOn: 'config-changed',
				minView: 'day'
				// renderOn: 'valid-dates-changed'
			};

			$scope.advancedCustomerSearch = function($event, orderConditions) {
				$event.preventDefault();
				var conditions = getOrderCondition(orderConditions);

				if (conditions.length === 0) {
					return flashServiceError('請至少勾選一項');
				}

				FlashService.clearFlashMessage();
				$scope.advanced.isLoading = true;
				$scope.search('searchOrderByCustomer', 
					{
						customerId: $scope.advanced.customer, 
						orderStatus: conditions
					}
				);

				stopLoading();
			};

			$scope.advancedDateSearch = function($event, orderConditions) {
				$event.preventDefault();
				var conditions = getOrderCondition(orderConditions);

				if (conditions.length === 0) {
					return flashServiceError('請至少勾選一項');
				}

				FlashService.clearFlashMessage();
				$scope.advanced.isLoading = true;
				$scope.search('searchOrderByDate', 
					{
						dateFrom: transferDateToNumber($scope.advanced.dateFrom), 
						dateEnd:  transferDateToNumber($scope.advanced.dateEnd), 
						orderStatus: conditions
					}
				);
				stopLoading();
			};

			/** date range render
			$scope.endDateOnSetTime = function() {
				$scope.$broadcast('end-date-changed');
			};

			$scope.startDateBeforeRender = function($dates) {
				if ($scope.advanced.dateEnd) {
					var activeDate = moment($scope.advanced.dateEnd);

					$dates.filter(function(date) {
						return date.localDateValue() >= activeDate.indexOf()
					}).forEach(function() {
						date.selectable = false
					})
				}
			};

			$scope.endDateBeforeRender = function($view, $dates) {
				if ($scope.advanced.dateFrom) {
					var activeDate = moment($scope.advanced.dateFrom).subtract(1, $view).add(1, 'minute');
					
					$dates.filter(function (date) {
	          			return date.localDateValue() <= activeDate.valueOf()
	        		}).forEach(function (date) {
	          			date.selectable = false;
	        		})
				}
			};
			**/

			function transferDateToNumber(date) {
				return $filter('date')(date, 'yyyyMMdd');
			}

			function flashServiceError(message) {
				return FlashService.error(message);
			}

			function getOrderCondition(orderConditions) {
				var conditions = [];

				angular.forEach(orderConditions, function(order, index) {
					if (order.selected) {
						conditions.push(order.statusId);
					}
				});

				return conditions;
			}

			function stopLoading() {
				$timeout(function() {
					$scope.advanced.isLoading = false;
				}, 1000);
			}


		}

	});

})();