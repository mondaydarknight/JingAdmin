(function() {
	'use strict';

	define([], function() {
		angular.module('JingAdmin')
			.filter('ProfileFilter', ProfileFilter)

		ProfileFilter.$inject = ['CONFIGURATION'];

		function ProfileFilter(CONFIGURATION) {

			return function(author, ext) {
				var ext = ext || '.jpg';
				return CONFIGURATION.IMAGE_URL + 'profile/' + author + ext;
			}
		}

	})


})();