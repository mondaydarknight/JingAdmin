(function() {
	'use strict';

	define([], function() {

		var app = angular
			.module('JingAdmin', 
			[
				'ui.bootstrap', 
				'ui.bootstrap.datetimepicker', 
				'ui.dateTimeInput', 
				'ngRoute',
				'ui.router',
				'ngAnimate', 
				'ngCookies',
				'ui.slimscroll',
				'ngTouch',
				'toastr'
			])
			.config(Config)
			.run(Run)

		Config.$inject = ['CONFIGURATION', '$stateProvider', '$urlRouterProvider', '$qProvider'];

		Run.$inject = ['$state', '$rootScope', '$location', 'AuthenticationService', 'SidebarService'];

		function Config(CONFIGURATION, $stateProvider, $urlRouterProvider, $qProvider) {
			// Deploy Provider Settings 
			// Conroller Diretive Register

			$stateProvider	
				.state('login', {
					url: '/login',
					templateUrl: CONFIGURATION.VIEW_URL + 'login.html',
					controller: 'LoginController'
				})

				.state('admin', {
					url: '/admin',
					templateUrl: CONFIGURATION.VIEW_URL + 'admin.html',
					controller: 'AdminController',
					abstract: true
				})

				.state('admin.home', {
					url: '/home',
					template: '<ui-view autoscroll="true" autoscroll-body-top ng-cloak></ui-view>',
					abstract: true,
					sidebarMeta: {
						mainItem: true,
						title: 'Home',
						icon: 'fa fa-home',
					}
				})
				.state('admin.home.lobby', {
					url: '/lobby',
					templateUrl: CONFIGURATION.VIEW_URL + 'home/lobby.html',
					controller: 'LobbyController',
					sidebarMeta: {
						mainItem: false,
						title: 'Lobby'
					}
				})
				.state('admin.home.user', {
					url: '/user',
					
					sidebarMeta: {
						mainItem: false,
						title: 'User'
					}
				})
				
				.state('admin.order', {
					url: '/order',
					template: '<ui-view autoscroll="true" autoscroll-body-top ng-cloak></ui-view>',
					abstract: true,
					sidebarMeta: {
						mainItem: true,
						icon: 'fa fa-list-alt',
						title: 'Order',
					}
				})
				.state('admin.order.manage', {
					url: '/manage', 
					templateUrl: CONFIGURATION.VIEW_URL + 'order/manage.html',
					controller: 'OrderManageController',
					sidebarMeta: {
						mainItem: false,
						title: 'Manage'
					}
				})

				.state('admin.customer', {
					url: '/customer',
					template: '<ui-view autoscroll="true" autoscroll-body-top ng-cloak></ui-view>',
					abstract: true,
					sidebarMeta: {
						mainItem: true,
						icon: 'ion-android-person',
						title: 'Customer'
					}
				})
				.state('admin.customer.manage', {
					url: '/manage',
					templateUrl: CONFIGURATION.VIEW_URL + 'customer/search.html',
					controller: 'CustomerManageController',
					sidebarMeta: {
						mainItem: false,
						title: 'Manage'
					}
				})
				.state('admin.customer.detail', {
					url: '/detail/:memberId',
					templateUrl: CONFIGURATION.VIEW_URL + 'customer/detail.html',
					controller: 'CustomerDetailController'
				})


			$urlRouterProvider.otherwise('/login');
			
			$qProvider.errorOnUnhandledRejections(false);
		}

		function Run($state, $rootScope, $location, AuthenticationService, SidebarService) {

			setRootEnvironment();
	
			detectUrlMiddleware();

			function setRootEnvironment() {
				$rootScope.globals = {user: {}};
				$rootScope.$SidebarService = SidebarService;
			}

			function detectUrlMiddleware() {
				$rootScope.$on('$locationChangeStart', function($event, state) {
					var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
					
					if (restrictedPage) {
						$rootScope.$evalAsync(function() {
							AuthenticationService.detectUserAdmin();
						});
					}
				});
			} 

		}

		return app;
	})



})();