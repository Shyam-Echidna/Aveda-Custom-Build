angular.module( 'Login', [] )

	.config( LoginConfig )
	.controller( 'LoginCtrl', LoginController )
	.factory('LoginFact', LoginFact )

;

function LoginConfig( $stateProvider ) {
	$stateProvider.state( 'login', {
		url: '/login',
		templateUrl:'login/templates/login.tpl.html',
		controller:'LoginCtrl',
		controllerAs: 'login',
		data:{ pageTitle: 'Login Page' }
	});
}

function LoginController($state,LoginFact, UserFactory, $cookieStore, appname) {
	var vm = this;
	vm.loginTabs = ["LOGIN","FORGOT PASSWORD"];
	vm.selectedIndex= 0;
	vm.activeTab = function(inx){
		vm.selectedIndex = inx;
	};
	vm.submit = function(credentials){
		LoginFact.Get(credentials).then(function(data){
			UserFactory.set().then(function(data){				
            	$cookieStore.put(appname + '.User', JSON.stringify(data));
				$state.go( 'base.dashboard' );
			});
		},function(error){
			console.log(error);

		});
	};
}

function LoginFact($http, authurl, clientid, ocscope, $q, UserFactory){
	var service = {
		Get: _get,
		Delete: _delete
	};
	return service;

	function _get(credentials) {
		var data = $.param({
			grant_type: 'password',
			scope: ocscope,
			client_id: clientid,
			username: credentials.Username,
			password: credentials.Password
		});
		var defferred = $q.defer();
		//return $resource(authurl, {}, { login: { method: 'POST'}}).login(data).$promise;
		$http({

                method: 'POST',
                url: authurl,
                data: data,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }

            }).success(function (data, status, headers, config) {
             	//console.log(_set_profile_cookie,data);
             	//_set_profile_cookie();
            	defferred.resolve(data);
            }).error(function (data, status, headers, config) {
        		defferred.reject(data);
            });
            return defferred.promise;
	}

	function _delete() {
		Auth.RemoveToken();
	}
}
