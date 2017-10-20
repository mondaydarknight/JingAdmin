(function() {
	'use strict';

	define([], function() {

		angular.module('JingAdmin')
			.provider('SidebarService', SidebarService)
			.directive('sidebarMenu', sidebarMenu)
			.controller('SidebarController', SidebarController)

			.directive('sidebarToggleItem', sidebarToggleItem)
			.controller('SidebarToggleController', SidebarToggleController)			
			.directive('sidebarUiSrefToggleSubmenu', sidebarUiSrefToggleSubmenu)
			.directive('sidebarUiSrefToggle', sidebarUiSrefToggle)
			
			/* Effect on other directives */
			.directive('sidebarToggleMenu', sidebarToggleMenu)
			.directive('sidebarCollapseMenu', sidebarCollapseMenu)


		sidebarMenu.$inject = ['$timeout', 'SidebarService', 'LAYOUT'];
		SidebarController.$inject = ['$scope', 'SidebarService'];
		SidebarToggleController.$inject = ['$scope', '$element', '$attrs', '$state', 'SidebarService'];
		sidebarUiSrefToggle.$inject = ['SidebarService'];

		sidebarToggleMenu.$inject = ['SidebarService'];
		sidebarCollapseMenu.$inject = ['SidebarService'];

		function SidebarService() {
			var staticMenuItems = [];

			this.addStaticItem = function() {
				staticMenuItems.push.apply(staticMenuItems, arguments);
			};

			this.$get = function($state, LAYOUT) {
				return new _factory();

				function _factory() {
					var isMenuCollapsed = shouldMenuBeCollapsed();

					this.getMenuItems = function() {
						var states = defineMenuItemStates();
						var menuItems = states.filter(function(state) {
							return state.mainItem === true;
						});

						menuItems.forEach(function(item) {
							var children = states.filter(function(child) {
								return child.mainItem === false && child.stateHref.indexOf(item.stateHref) === 0;
							});

							item.subMenu = children.length ? children : null;
						});

						return menuItems.concat(staticMenuItems);
					};

					this.shouldMenuBeCollapsed = shouldMenuBeCollapsed;
					this.canSidebarBeHidden = canSidebarBeHidden;

					this.setMenuCollapsed = function(isCollapsed) {
						isMenuCollapsed = isCollapsed;
					};

					this.isMenuCollapsed = function() {
						return isMenuCollapsed;
					};

					this.toggleMenuCollapsed = function() {
						isMenuCollapsed = !isMenuCollapsed;
					};

					/* fixedHref is out href */
					/* Include external menu */
					this.getAllStateHrefRecursive = function(item) {
						var result = [];

						_iterateSubItems(item);
						return result;

						function _iterateSubItems(currentItem) {
							currentItem.subMenu && currentItem.subMenu.forEach(function(subItem) {
								subItem.stateHref && result.push(subItem.stateHref);
								_iterateSubItems(subItem);
							});
						}
					};

				}

				function defineMenuItemStates() {
					return $state.get()
							.filter(function(s) {
								return s.sidebarMeta;
							})
							.map(function(s) {
								var meta = s.sidebarMeta;
								return {
									mainItem: meta.mainItem,
									title: meta.title,
									icon: meta.icon,
									stateHref: s.name,
									// level: (s.name.match(/\./g) || []).length,
								}
							})
							// .sort(function(a, b) {
							// 	console.log((a.level - b.level) * 100 + a.order - b.order);
							// 	return (a.level - b.level) * 100 + a.order - b.order;
							// })
				}

				function shouldMenuBeCollapsed() {
			 		return window.innerWidth <= LAYOUT.resWidthCollapseSidebar;
				}

				function canSidebarBeHidden() {
					return window.innerWidth <= LAYOUT.resWidthHideSidebar;
				}
			};
		}

		/* directive sidebarMneu */
		function sidebarMenu($timeout, SidebarService, LAYOUT) {
			var jqWindow = $(window);
			return {
				templateUrl: 'src/app/view/components/sidebar.html',
				controller: 'SidebarController',

				link: function(scope, element) {
					scope.menuHeight = element[0].childNodes[0].clientHeight - 84;
					
					jqWindow.on('click', _onWindowClick);
        			jqWindow.on('resize', _onWindowResize);

        			scope.$on('$destroy', function() {
          				jqWindow.off('click', _onWindowClick);
          				jqWindow.off('resize', _onWindowResize);
        			});

					function _onWindowClick($event) {
						if (!$event.originalEvent.$sidebarEventProcessed &&
							!SidebarService.isMenuCollapsed() && 
							SidebarService.canSidebarBeHidden()) {
							
							$event.originalEvent.$sidebarEventProcessed = true;
							$timeout(function() {
								SidebarService.setMenuCollapsed(true);
							}, 10);
						}
					}

					function _onWindowResize() {
						var newMenuCollapsed = SidebarService.shouldMenuBeCollapsed();
						var newMenuHeight = _calculateMenuHeight();

						if (newMenuCollapsed !== SidebarService.isMenuCollapsed() || scope.menuHeight !== newMenuHeight) {
							scope.$apply(function() {
								scope.menuHeight = newMenuHeight;
								SidebarService.setMenuCollapsed(newMenuCollapsed);
							});
						}
					}

					function _calculateMenuHeight() {
						return element[0].childNodes[0].clientHeight - 84;
					}

				}
			}
		}

		function SidebarController($scope, SidebarService) {
			$scope.menuItems = SidebarService.getMenuItems();
			$scope.defaultSidebarState = $scope.menuItems[0].stateHref;

			$scope.hoverItem = function($event) {
				var menuTopValue = 66;
				$scope.showHoverElement = true;
				$scope.hoverElementHeight = $event.currentTarget.clientHeight;
				$scope.hoverElementTop = $event.currentTarget.getBoundingClientRect().top - menuTopValue;
			};

			$scope.$on('$stateChangeSuccess', function() {
				if (SidebarService.canSidebarBeHidden()) {
					SidebarService.setMenuCollapsed(true);
				}
			});

		}

		function sidebarToggleItem() {
			return {
				restrict: 'A',
				controller: 'SidebarToggleController'
			}
		}

		function SidebarToggleController($scope, $element, $attrs, $state, SidebarService) {
			/* sidebarToggleItem is a directive of $attrs */
			var vm = this;
			var menuItem = vm.$$menuItem = $scope.$eval($attrs.sidebarToggleItem);

			if (menuItem && menuItem.subMenu && menuItem.subMenu.length) {
				var subItemsStateHref = SidebarService.getAllStateHrefRecursive(menuItem);

				vm.$$expandSubmenu = function() {
					// console.warn('$$expandMenu should be overwritten by baUiSrefTogglingSubmenu');
				};

				vm.$$collapseSubmenu = function() {
					// console.warn('$$collapseSubmenu should be overwritten by baUiSrefTogglingSubmenu');
				};

				vm.$expand = function() {
					vm.$$expandSubmenu();
					$element.addClass('ba-sidebar-item-expanded');
				};

				vm.$collapse = function() {
					vm.$$collapseSubmenu();
					$element.removeClass('ba-sidebar-item-expanded');
				};

				vm.$toggle = function() {
					$element.hasClass('ba-sidebar-item-expanded') ? vm.$collapse() : vm.$expand();
				};

				if (_isState($state.current)) {
					$element.addClass('ba-sidebar-item-expanded');
				}

				$scope.$on('$stateChangeStart', function($event, state) {
					if (!_isState(state) && $element.hasClass('ba-sidebar-item-expanded')) {
						vm.$collapse();
					}
				});

				$scope.$on('$stateChangeSuccess', function($event, state) {
					if (_isState(state) && !$element.hasClass('ba-sidebar-item-expanded')) {
						vm.$expand();
						// $element.removeClass('ba-sidebar-item-expanded');
					}
				});

				function _isState(state) {
					return state && subItemsStateHref.some(function(subItemState) {
						return state.name.indexOf(subItemState) === 0;
					});
				}
			}
		}

		function sidebarUiSrefToggle(SidebarService) {
			return {
				restrict: 'A',
				require: '^sidebarToggleItem',
				link: function(scope, element, attrs, controller) {
					element.on('click', function() {
						if (SidebarService.isMenuCollapsed()) {
							scope.$apply(function() {
								SidebarService.setMenuCollapsed(false);
							});

							controller.$expand();
						} else {	
							controller.$toggle();
						}
					});
				}
			}
		}

		function sidebarUiSrefToggleSubmenu() {
			return {
				restrict: 'A',
				require: '^sidebarToggleItem',
				link: function(scope, element, attrs, controller) {

					controller.$$expandSubmenu = function() {
						element.slideDown();
					};

					controller.$$collapseSubmenu = function() {
						element.slideUp();
					};
				}
			}
		}

		function sidebarToggleMenu(SidebarService) {
			return {
				restrict: 'A',
				link: function(scope, element) {
					element.on('click', function($event) {
						$event.originalEvent.$sidebarEventProcessed = true;

						scope.$apply(function() {
							SidebarService.toggleMenuCollapsed();
						});
					});
				}
			}
		}

		function sidebarCollapseMenu(SidebarService) {
			return {
				restrict: 'A',
				link: function(scope, element) {

					element.on('click', function() {
						$event.originalEvent.$sidebarEventProcessed =true;

						if (!SidebarService.isMenuCollapsed()) {
							scope.$apply(function() {
								SidebarService.setMenuCollapsed(true);
							});
						}
					});
				}
			}
		}


	})

})();