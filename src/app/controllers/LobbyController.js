(function() {
	'use strict';

	define([], function() {
		angular.module('JingAdmin')
			.controller('LobbyController', LobbyController)

		LobbyController.$inject = ['$scope', 'CONFIGURATION'];

		function LobbyController($scope, CONFIGURATION) {

			$scope.messages = [
				{
		        	type: 'text-message',
		        	author: 'Nasta',
		        	header: 'Posted new message',
		        	text: '您好: \n我最近訂購的咖啡豆到目前還沒送來，能幫我確認一下訂貨資訊嗎?',
		        	time: 'Today 11:55 pm',
		        	ago: '25 minutes ago',
		      	}, {
		        	type: 'video-message',
		        	author: '李孟哲',
		        	header: 'Added new video',
		        	text: '訂貨有收到',
		        	preview: 'app/feed/vader-and-me-preview.png',
		        	link: 'https://www.youtube.com/watch?v=IfcpzBbbamk',
		        	time: 'Today 9:30 pm',
		        	ago: '3 hrs ago',
		      	}, {
		        	type: 'image-message',
		        	author: '蔡明彥',
		        	header: 'Added new image',
		        	text: '戚風蛋糕送來有損毀',
		        	preview: 'app/feed/my-little-kitten.png',
		        	link: 'http://api.ning.com/files/DtcI2O2Ry7A7VhVxeiWfGU9WkHcMy4WSTWZ79oxJq*h0iXvVGndfD7CIYy-Ax-UAFCBCdqXI4GCBw3FOLKTTjQc*2cmpdOXJ/1082127884.jpeg',
		        	time: 'Today 2:20 pm',
		        	ago: '10 hrs ago',
		      	}, {
		        	type: 'text-message',
		        	author: '何家仁',
		        	header: 'Posted new message',
		        	text: 'Haha lol',
		        	time: '11.11.2015',
		        	ago: '2 days ago',
		      	}
			];

			$scope.expandMessage = function(message) {
				message.expanded = !message.expanded;
			};


			function messageExpandSettings() {
				angular.forEach($scope.messages, function(message) {
					angular.extend(message, {expanded: false, profile: '//ssl.gstatic.com/accounts/ui/avatar_2x.png'});
				});
			}


			messageExpandSettings();
		}

	});

})();