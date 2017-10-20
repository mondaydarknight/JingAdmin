(function() {
	'use strict';

	angular
		.module('JingAdmin')
		.constant('LAYOUT', {
			resWidthCollapseSidebar: 1200,
			resWidthHideSidebar: 500
		})
		.constant('CONFIGURATION', {
			SERVER_URL: 'src/server/',
			CONFIG_URL: 'src/app/config/',
			VIEW_URL: 'src/app/view/',
			IMAGE_URL: 'src/assets/img/',
			ICONS: {
				home: 'fa fa-home home-icon',
				order: 'fa fa-list-alt',
				customer: 'ion-android-person'	
			}
		})
		
		.config(['toastrConfig', function(toastrConfig) {
			angular.extend(toastrConfig, {
				closeButton: true,
				closeHtml: '<button>&times;</button>',
				timeOut: 5000,
				autoDismiss: false,
				containerId: 'toast-container',
				maxOpened: 0,
				newsOnTop: true,
				positionClass: 'toast-top-right',
				preventDuplicates: false,
				preventOpenDuplicates: false,
				target: 'body'
			});
		}])
		

})();