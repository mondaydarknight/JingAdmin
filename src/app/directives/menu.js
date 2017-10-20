(function() {
	'use strict';

	angular
		.module('JingAdmin')
		.directive('headerMenu', HeaderMenu)
		.directive('mainMenu', MainMenu)
		.directive('contentMenu', ContentMenu)
		.directive('footerEnd', FooterEnd)

	HeaderMenu.$inject = ['$route', '$rootScope'];
	MainMenu.$inject = ['$rootScope', '$location', '$timeout'];
	ContentMenu.$inject = ['$compile'];
	

	function HeaderMenu($route, $rootScope) {

		return {
			restrict: 'E',
			templateUrl: 'src/view/components/header.menu.html',
			controller: 'HeaderController'
			// link: function(scope, element) {
			// 	scope.isCollapsed = true;
					
			// 	$timeout(function() {
			// 		scope.username = $rootScope.currentUser.username;					
			// 	}, 200);

			// 	scope.logout = function($event) {
			// 		$event.preventDefault();
			// 		AuthenticationService.logout();
			// 	};
			// }
		};
	}


	function MainMenu($rootScope, $location, $timeout) {
		return {
			restrict: 'EA',
			template: 	'<div class="nav">'+
						'<a ng-repeat="route in configuration.routes" class="horizontal-nav" ng-click="menuLocationChange($event, route.location)">'+
						'<div class="inner-nav">'+			
						'<div class="inner-nav-icon">'+	
      					'<i class="fa {{route.icon}} fa-3x fa-fw"></i>'+
      					'</div>'+
    					'</div>'+
    					'<div class="bottom-nav">'+
      					'<div class="title-container">'+
        				'<span class="nav-title ">{{route.subject}}</span>'+
      					'</div>'+
    					'</div>'+
  						'</a>'+
						'</div>',
			link: function(scope, element, attr) {
				scope.configuration = {};

				$timeout(function() {
					scope.configuration.routes = $rootScope.globals.configuration;
					
					scope.menuLocationChange = function($event, route) {
						$event.preventDefault();
						$location.path(route);
					};
					
				}, 500);
			}
		}

	}

	function ContentMenu($compile) {
		return {
			restrict: 'EA',
			link: function($scope, element) {
				$scope.$watch('routeAhead', function(newVal, oldVal){
				    if ($scope.routeAhead !== undefined) {
				    	element.html($compile('<ng-include src="\'src/view'+ $scope.routeAhead +'.html\'"></ng-include>')($scope));
				    }
				}, true);
			}
		}
	}


	

})();