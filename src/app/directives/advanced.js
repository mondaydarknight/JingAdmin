(function() {
	'use strict';

	define([], function() {
		angular.module('JingAdmin')
			.directive('advancedOption', advancedOption)
			.directive('advancedOptionContent', advancedOptionContent)

		function advancedOption() {
			return {
				restrict: 'A',
				template: 	'<div class="btn-group" uib-dropdown>'+
          					'<a href class="btn btn-info btn-xs" aria-selected="false" uib-dropdown-toggle>進階搜尋</a>'+
          					'<ul class="dropdown-menu" role="menu" aria-labelledby="advancedOptions" uib-dropdown-menu>'+
          					'<li ng-repeat="option in advancedOptions">'+
          					'<a href ng-click="launchAdvance($event, option.url)">{{::option.name}}</a>'+
          					'</li>'+
          					'</ul>'+
          					'</div>',
				link: function(scope, element, attrs) {
					scope.advancedOptions = 
						[
							{category: 'customer', name: '顧客查詢', url: 'advanced.customer.html'}, 
							{category: 'date', name: '日期查詢', url: 'advanced.date.html'}
						];
				}
			}
		}

		function advancedOptionContent() {
			return {
				restrict: 'A',
				template: '<div></div>',
				link: function(scope, element, attrs) {
					
				}
			}
		}

	})

})();