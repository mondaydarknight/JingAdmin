(function() {
	'use strict';

	/* Generate Factory Toastr */

	angular
		.module('toastr', [])
		.factory('toastr', Toastr)

	Toastr.$inject = ['$animate', '$injector', '$document', '$rootScope', '$sce', 'toastrConfig', '$q'];

	function Toastr($animate, $injector, $document, $rootScope, $sce, toastrConfig, $q) {
		var container;
	    var index = 0;
	    var toasts = [];

	    var previousToastMessage = '';
	    var openToasts = {};

	    var containerDefer = $q.defer();

		var toast = {
      		active: active,
      		clear: clear,
      		error: error,
      		info: info,
      		remove: remove,
      		success: success,
      		warning: warning,
      		refreshTimer: refreshTimer
    	};

    	return toast;

    	/* Public API */
    	function active() {
    		return toasts.length;
    	}

    	function clear(toast) {
    		if (arguments === 1 && !toast) 
    			return;

    		if (toast) {
    			return remove(toast.toastId);
    		}

    		for (var i = 0; i < toasts.length; i++) {
    			remove(toast[i].toastId);
    		}

    	}

    	function error(message, title, optionsOverride) {
    		var type = _getOptions().iconClasses.error;
    		return _buildNotification(type, message, title, optionsOverride);
    	}

    	function info(message, title, optionsOverride) {
    		var type = _getOptions().iconClasses.info;
    		return _buildNotification(type, message, title, optionsOverride);
    	}

    	function success(message, title, optionsOverride) {
    		var type = _getOptions().iconClasses.success;
    		return _buildNotification(type, message, title, optionsOverride);
    	}

    	function warning(message, title, optionsOverride) {
    		var type = _getOptions().iconClasses().warning;
    		return _buildNotification(type, message, title, optionsOverride);
    	}

    	function refreshTimer(toast, newTime) {
    		(toast && toast.isOpened && toasts.indexOf(toast) >= 0) ? toast.scope.refreshTimer(newTime) : false; 
    	}

    	function remove(toastId, wasClick) {
    		var toast = findToast(toastId);

    		if (toast && !toast.deleting) {
    			// avoid clicking when fading out
    			toast.deleting = true;
    			toast.isOpened = false;

    			$animate.leave(toast.el).then(function() {
    				toast.scope.options.onHidden ? toast.scope.options.onHidden(!!wasClick, toast) : false;
    				toast.scope.$destroy();

    				var index = toasts.indexOf(toast);
    				var maxOpened = toastrConfig.maxOpened;

    				toasts.splice(index, 1);
    				delete openToasts[toast.scope.message];

    				(maxOpened && toasts.length >= maxOpened) ? toasts[maxOpened - 1].open.resolve() : false;

    				if (lastToast()) {
    					container.remove();
    					container = null;
    					containerDefer = $q.defer();
    				}
    			});
    		}

    		function findToast(toastId) {
    			for (var i = 0; i < toasts.length; i++) {
    				if (toasts[i].toastId === toastId) {
    					return toasts[i];
    				}
    			}
	    	}

	    	function lastToast() {
	    		return !toasts.length;	
	    	}
    	}

    	/* Internal functions */
    	function _buildNotification(type, message, title, optionsOverride) {
    		if (angular.isObject(title)) {
    			optionsOverride = title;
    			title = null;
    		}

    		return _notify({
    			iconClass: type,
    			message: message,
    			title: title,
    			optionsOverride: optionsOverride
    		})

    	}

    	function _getOptions() {
    		return angular.extend({}, toastrConfig);
    	}

    	function _createOrGetContainer(options) {
    		if (container) {
    			return containerDefer.promise;
    		}

    		container = angular.element('<div></div>');
    		container.attr('id', options.containerId);
    		container.addClass(options.positionClass);
    		container.css('pointer-events', 'auto');

    		var target = angular.element(document.querySelector(options.target));

    		if (!target || !target.length) {
    			throw 'Target for toasts doesn\'t exist';
    		}

    		$animate.enter(container, target).then(function() {
    			containerDefer.resolve();
    		});

    		return containerDefer.promise;
    	}

    	function _notify(map) {
    		// get toastrConfig
    		var options = _getOptions();

    		if (enforceExit()) {
    			return;
    		}

    		var newToast = createToast();

    		toasts.push(newToast);

    		if (isMaxOpenedAndAutoDismiss()) {
    			var oldToasts = toasts.slice(0, (toasts.length - options.maxOpened));

    			for (var i = 0; i < oldToasts.length; i++) {
    				remove(oldToasts[i].toastId);
    			}
    		}

    		if (isMaxOpenedNotReached()) {
    			newToast.open.resolve();
    		}

    		newToast.open.promise.then(function() {
    			_createOrGetContainer(options).then(function() {
    				newToast.isOpened = true;

    				if (options.newestOnTop) {    					
    					$animate.enter(newToast.el, container).then(function() {
    						newToast.scope.init();
    					});
    				} else {
    					var sibling = container[0].lastChild ? angular.element(container[0].lastChild) : null;
    					$animate.enter(newToast.el, container, sibling).then(function() {
    						newToast.scope.init();
    					});
    				}
    			});
    		});

    		return newToast;

    		function createToast() {

    			var newToast = {
    				toastId: index++,
    				isOpened: false,
    				scope: $rootScope.$new(),
    				open: $q.defer()
    			};

    			newToast.iconClass = map.iconClass;

    			if (map.optionsOverride) {
    				angular.extend(options, cleanOptionsOverride(map.optionsOverride));
    				newToast.iconClass = map.optionsOverride.iconClass || newToast.iconClass;
    			}

    			createScope(newToast, map, options);
    			newToast.el = createToastElement(newToast.scope);

    			return newToast;

    			function cleanOptionsOverride(options) {
    				var badOptions = [
    					'containerId', 
    					'iconClasses', 
    					'maxOpened', 
    					'newestOnTop',
                        // 'positionClass', 
                        'preventDuplicates', 
                        'preventOpenDuplicates', 
                        'templates'];
    				
    				for (var i = 0; i < badOptions.length; i++) {
    					delete options[badOptions[i]];
    				}

    				return options;
    			}
    		}

    		function createScope(toast, map, options) {
    			if (options.allowHtml) {
    				toast.scope.allowHtml = true;
    				toast.scope.title = $sce.trustAsHtml(map.title);
    				toast.scope.message = $sce.trustAsHtml(map.message);
    			} else {
    				toast.scope.title = map.title;
    				toast.scope.message = map.message;
    			}

    			toast.scope.toastType = toast.iconClass;
    			toast.scope.toastId = toast.toastId;
    			toast.scope.extraData = options.extraData;

    			toast.scope.options = {
          			extendedTimeOut: options.extendedTimeOut,
          			messageClass: options.messageClass,
          			onHidden: options.onHidden,
          			onShown: generateEvent('onShown'),
          			onTap: generateEvent('onTap'),
          			progressBar: options.progressBar,
          			tapToDismiss: options.tapToDismiss,
          			timeOut: options.timeOut,
          			titleClass: options.titleClass,
          			toastClass: options.toastClass
        		};

        		if (options.closeButton) {
        			toast.scope.options.closeHtml = options.closeHtml;
        		}

        		function generateEvent(event) {
        			if (options.event) {
        				return function() {
        					options[event](toast);
        				}
        			}
    			}
    		}

    		function createToastElement(scope) {
    			var angularDOMElement = angular.element('<div toast></div>');
    			var $compile = $injector.get('$compile');

    			return $compile(angularDOMElement)(scope);
    		}

    		function isMaxOpenedAndAutoDismiss() {
    			return options.autoDismiss && options.maxOpened && toasts.length > options.maxOpened;
    		}

    		function isMaxOpenedNotReached() {
    			return options.maxOpened && toasts.length <= options.maxOpened || !options.maxOpened;
    		}

    		function enforceExit() {
    			var isDuplicateOfLast = options.preventDuplicates && map.message === previousToastMessage;
    			var isDuplicateOpen = options.preventOpenDuplicates && openToasts[map.message];
    		
    			if (isDuplicateOfLast || isDuplicateOpen) {
    				return true;
    			}

    			previousToastMessage = map.message;
    			openToasts[map.message] = true;
    			return false;
    		}
    	}
	}

})();

(function() {
	'use strict';

	/* Generate Constant toastrConfig */
	angular.module('toastr')
		.constant('toastrConfig', {
      		allowHtml: false,
      		autoDismiss: false,
      		closeButton: false,
      		closeHtml: '<button>&times;</button>',
      		containerId: 'toast-container',
      		extendedTimeOut: 1000,
      		iconClasses: {
        		error: 'toast-error',
        		info: 'toast-info',
        		success: 'toast-success',
        		warning: 'toast-warning'
      		},
      		maxOpened: 0,
      		messageClass: 'toast-message',
      		newestOnTop: true,
      		onHidden: null,
      		onShown: null,
      		onTap: null,
      		positionClass: 'toast-top-right',
      		preventDuplicates: false,
      		preventOpenDuplicates: false,
      		progressBar: false,
      		tapToDismiss: true,
      		target: 'body',
      		templates: {
        		toast: 'directives/toast/toast.html',
        		progressbar: 'directives/progressbar/progressbar.html'
      		},
      		timeOut: 5000,
      		titleClass: 'toast-title',
      		toastClass: 'toast'
    });

})();

(function() {
	'use strict';

	angular
		.module('toastr')
		.controller('ToastController', ToastController)

	function ToastController() {
		this.progressBar = null;

		this.startProgressBar = function(duration) {
			this.progressBar ? this.progressBar.start(duration) : false;
		};

		this.stopProgressBar = function() {
			this.progressBar ? this.progressBar.stop() : false;
		};
	}


})();

(function() {
	'use strict';

	angular.module('toastr')
		.directive('progressBar', ProgressBar)

	ProgressBar.$inject = ['toastrConfig'];

	function ProgressBar(toastrConfig) {
		return {
			require: '^toast',
			templateUrl: function() {
				return toastrConfig.templates.progressbar;
			},
			link: function(scope, element, attrs, controller) {
				var intervalId;
				var currentTimeout;
				var hideTime;

				controller.progressBar = scope;

				scope.start = function(duration) {
					intervalId ? clearInterval(intervalId) : false;	
					currentTimeout = parseFloat(duration);
					hideTime = new Date().getTime() + currentTimeout;
					intervalId = setInterval(updateProgress, 10);
				};	

				scope.stop = function() {
					intervalId ? clearInterval(intervalId) : false;
				};

				scope.$on('$destroy', function() {
					clearInterval(intervalId);
				});

				function updateProgress() {
					var percentage = ((hideTime - (new Date().getTime())) / currentTimeout) * 100;
					element.css('width', percentage + '%');
				}
			}
		}
	}

})();

(function() {
	'use strict';

	angular
		.module('toastr')
		.directive('toast', Toast) 

	Toast.$inject = ['$injector', '$interval', 'toastrConfig', 'toastr'];

	function Toast($injector, $interval, toastrConfig, toastr) {
		return {
			templateUrl: function() {
				return toastrConfig.templates.toast;
			},
			controller: 'ToastController',
			link: function(scope, element, attrs, controller) {
				var timeout;

				scope.toastClass = scope.options.toastClass;
				scope.titleClass = scope.options.titleClass;
				scope.messageClass = scope.options.messageClass;
				scope.progressBar = scope.options.progressBar;

				if (closeButton()) {
					var button = angular.element(scope.options.closeHtml);
					var $compile = $injector.get('$compile');

					button.addClass('toast-close-button').attr('ng-click', 'close(true, $event)');
					$compile(button)(scope);
					element.children().prepend(button);
				}

				element.on('mouseenter', function() {
					hideAndStopProgressBar();
					timeout ? $interval.cancel(timeout) : false;		
				});

				element.on('mouseleave', function() {
					if (scope.options.timeOut === 0 && scope.options.extendedTimeOut === 0 ) {
						return;
					}

					scope.$apply(function() {
						scope.progressBar = scope.options.progressBar;
					});

					timeout = createTimeout(scope.options.extendedTimeOut);
				});

				scope.init = function() {
					if (scope.options.timeOut) {
						timeout = createTimeout(scope.options.timeOut);
					}

					if (scope.options.onShown) {
						scope.options.onShown();
					}
				};

				scope.tapToast = function() {
					angular.isFunction(scope.options.onTap) ? scope.options.onTap() : false;
					scope.options.tapToDismiss ? scope.close(true) : false;
				};

				scope.close = function(wasClick, $event) {
					if ($event && angular.isFunction($event.stopPropagation)) {
						$event.stopPropagation();
					}

					toastr.remove(scope.toastId, wasClick);
				};

				scope.refreshTimer = function(newTime) {
					if (timeout) {
						$interval.cancel(timeout);
						timeout = createTimeout(newTime || scope.options.timeOut);
					}
				};

				function createTimeout(time) {
					controller.startProgressBar(time);

					return $interval(function() {
						controller.stopProgressBar();
						toastr.remove(scope.toastId);
					}, time, 1);
				}

				function hideAndStopProgressBar() {
					scope.progressBar = false;
					controller.stopProgressBar();
				}

				function closeButton() {
					return scope.options.closeHtml;
				}
			}
		}
	}

})();

angular.module("toastr")
	.run(["$templateCache", function($templateCache) {
		$templateCache.put(
			"directives/progressbar/progressbar.html",
			"<div class=\"toast-progress\"></div>\n");
		// $templateCache.put(
		// 	"directives/toast/toast.html",
		// 	"<div class=\"{{toastClass}} {{toastType}}\" ng-click=\"tapToast()\">\n  <div ng-switch on=\"allowHtml\">\n <div ng-switch-default ng-if=\"title\" class=\"{{titleClass}}\" aria-label=\"{{title}}\">{{title}}</div>\n <div ng-switch-default class=\"{{messageClass}}\" aria-label=\"{{message}}\">{{message}}</div>\n    <div ng-switch-when=\"true\" ng-if=\"title\" class=\"{{titleClass}}\" ng-bind-html=\"title\"></div>\n    <div ng-switch-when=\"true\" class=\"{{messageClass}}\" ng-bind-html=\"message\"></div>\n  </div>\n  <progress-bar ng-if=\"progressBar\"></progress-bar>\n</div>\n"
		// 	);
		$templateCache.put(
				'directives/toast/toast.html',
				'<div class="{{toastClass}} {{toastType}}" ng-click="tapToast()">'+
				'<div ng-switch on="allowHtml">'+
				'<div ng-switch-default ng-if="title" class="{{titleClass}}" aria-label="{{title}}">{{title}}</div>'+			
				'<div ng-switch-default class="{{messageClass}}" aria-label="{{message}}">{{message}}</div>'+
				'<div ng-switch-when="true" ng-if="title" class="{{titleClass}}" ng-bind-html="title"></div>'+
				'<div ng-switch-when="true" class="{{messageClass}}" ng-bind-html="message"></div>'+
				'</div>'+
				'<progress-bar ng-if="progressBar"></progress-bar></div>'	
			);
		
	}]);


