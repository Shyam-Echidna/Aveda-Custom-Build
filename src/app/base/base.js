angular.module( 'orderCloud.base', [
	'ui.router'
])

	.config(BaseConfig)
	.controller( 'BaseCtrl', BaseController)
	.factory('BaseFact',BaseFactory)
;

function BaseConfig( $stateProvider ) {
	$stateProvider.state( 'base', {
		abstract: true,
		url: '',
		resolve: {
			isAuthenticated: function( Auth, $state ) {
				return Auth.IsAuthenticated().catch( function() {
						$state.go( 'login' );
					}
				);
			}
		},
		views: {
			'': {
				templateUrl: 'base/templates/base.tpl.html',
				controller: 'BaseCtrl',
				controllerAs: 'base'
			},
			'top@base': {
				templateUrl: 'base/templates/base.top.tpl.html'
			},
			'left@base': {
				templateUrl: 'base/templates/base.left.tpl.html'
			},
			'right@base': {
				templateUrl: 'base/templates/base.right.tpl.html'
			},
			'bottom@base': {
				templateUrl: 'base/templates/base.bottom.tpl.html'
			}
		}
	});
}

function BaseController( $state, UserFactory,BaseFact) {
	//BaseFact.GetMe();
	
	var vm = this;
	vm.swiped = 'none';
	vm.showMobileSearch = false;
	vm.searchType = 'Products';
	vm.isCollapsed = true;
	vm.subClaimsisCollapsed = true;

	vm.user = UserFactory.get();
	vm.searchTypes = [
		"Products",
		"Salons"
	];
	 BaseFact.getAll().then(function (items) {
		vm.cats = unflatten(items.Items);
	});
	
	vm.setSearchType = function(type) {
		vm.searchType = type;
	};

	vm.drawers = {
		left: false,
		right: false
	};

	vm.onDropdownToggle = function() { //TODO: this isn't really working
		vm.showMobileSearch = false;
		vm.closeDrawers();
	};

	vm.toggleSearch = function() {
		vm.closeDrawers();
		vm.showMobileSearch = !vm.showMobileSearch;
	};

	vm.toggleDrawer = function(drawer) {
		vm.showMobileSearch = false;
		angular.forEach(vm.drawers, function(value, key) {
			if (key != drawer) vm.drawers[key] = false;
		});
		vm.drawers[drawer] = !vm.drawers[drawer];
	};

	vm.logout = function() {
		//Users.Logout();
		UserFactory.remove();
		$state.go( 'login' );
	};

	vm.closeDrawers = function() {
		angular.forEach(vm.drawers, function(value, key) {
			vm.drawers[key] = false;
		});
	}
}

function BaseFactory($http,$q){

        return {
          
            getAll: function() {
                var deferred = $q.defer();
                $http({ method: "GET", 
                	url: "https://testapi.ordercloud.io/v1/buyers/2/categories" })
                    .success(function (data, status, headers, config) {
                    	
                        deferred.resolve(data);
                    }).error(function (data, status, headers, config) {
                        deferred.reject(data);
                    });
                return deferred.promise;
            }
        };
}

   
