(function() {
	'use strict';

	require.config({
		baseUrl: 'src/app',
    	urlArgs: 'v=1.0'
	});

	require([
		'app',
		'deploy',
			
		'services/Authentication',
		'services/HttpService',
		'services/FlashService',
		
		'controllers/HeaderController',
		'controllers/LoginController',
		'controllers/AdminController',
		'controllers/LobbyController',
		'controllers/OrderManageController',
		'controllers/CustomerManageController',

		'filters/image/profile',

		'directives/header',
		'directives/footer',
		'directives/sidebar',
		'directives/directoryBreadcrumb',
		'directives/advancedOption',
		'directives/order',

		'directives/alert'


	], function() {
		angular.bootstrap(document, ['JingAdmin']);
	});

})();