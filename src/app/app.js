angular.module( 'orderCloud', [
	'templates-app',
	'ngSanitize',
	'ngAnimate',
	'ngMessages',
	'ngCookies',
	'ngTouch',
	'ui.router',
	'orderCloud.base',
	'orderCloud.dashboard',
    'orderCloud.browse',
	'Login',
    'orderCloud.profile'
])

	.config( Routing )
	.config( ErrorHandling )
	.controller( 'AppCtrl', AppCtrl )
	.factory('Auth', AuthFactory)
	.factory('Request', RequestFactory)
    .factory('UserFactory', UserFactory)
	.constant('ocscope', 'FullAccess')
	.constant('appname', 'Aveda')
	
	// Test
	 .constant('authurl', 'https://testauth.ordercloud.io/oauth/token')
	 .constant('apiurl', 'https://testapi.ordercloud.io/v1')
	 .constant('clientid', '018ddfbd-aff8-413a-8518-f45fc774619b')	 
	 .config(Interceptor)
;

function AppCtrl( $scope ) {
	var vm = this;
	$scope.$on('$stateChangeSuccess', function( event, toState, toParams, fromState, fromParams ){
		if ( angular.isDefined( toState.data.pageTitle ) ) {
			vm.pageTitle = 'Aveda | ' + toState.data.pageTitle;
		}
	});
}

function Routing( $urlRouterProvider, $urlMatcherFactoryProvider ) {
	$urlMatcherFactoryProvider.strictMode(false);
	$urlRouterProvider.otherwise( '/dashboard' );
	//$locationProvider.html5Mode(true);
	//TODO: For HTML5 mode to work we need to always return index.html as the entry point on the serverside
}

function ErrorHandling( $provide ) {
	$provide.decorator('$exceptionHandler', handler );

	function handler( $delegate, $injector ) {
		return function $broadcastingExceptionHandler( ex, cause ) {
			ex.status != 500 ?
				$delegate( ex, cause ) :
				( function() {
					try {
						//TODO: implement track js
						console.log(JSON.stringify( ex ));
						//trackJs.error("API: " + JSON.stringify(ex));
					}
					catch ( ex ) {
						console.log(JSON.stringify( ex ));
					}
				})();
			$injector.get( '$rootScope' ).$broadcast( 'exception', ex, cause );
		}
	}
}
function AuthFactory($cookieStore, $q, appname) {
    var service = {
        GetToken: _get,
        SetToken: _set,
        RemoveToken: _remove,
        IsAuthenticated: _isAuthenticated
    };
    return service;

    ///////////////
    function _get() {
        //TODO: setup auth token storage
        return $cookieStore.get(appname + '.token');
    }

    function _set(token) {
        $cookieStore.put(appname + '.token', token);
    }

    function _remove() {
        $cookieStore.remove(appname + '.token');
    }

    function _isAuthenticated() {
        var deferred = $q.defer();

        if ($cookieStore.get(appname + '.token')) {
            deferred.resolve($cookieStore.get(appname + '.token'));
        } else {
            deferred.reject();
        }
        return deferred.promise;

        /*var token = $cookieStore.get(appname + '.token');
        return token != null;*/
    }

}
AuthFactory.$inject = ["$cookieStore", "$q", "appname"];
function Interceptor($httpProvider) {
    $httpProvider.interceptors.push('Request');
}
Interceptor.$inject = ["$httpProvider"];

function RequestFactory($q, $rootScope, Auth) {
    var service = {
        'request': _request,
        'response': _response,
        'responseError': _error
    };
    return service;

    function appendAuth(config) {
        if (config.url.indexOf('OAuth') > -1) config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        if (Auth.GetToken()) config.headers['Authorization'] = 'Bearer ' + Auth.GetToken();
        return config;
    }

    function _request(config) {
        return appendAuth(config) || $q.when(appendAuth(config));
    }

    function _response(response) {
        if (response.status === 200 && response.data && response.data['access_token']) {
            Auth.SetToken(response.data['access_token']);
            $rootScope.$broadcast('event:auth-loginConfirmed', response.data);
        }

        return response || $q.when(response);
    }

    function _error(response) {
        if (response.status === 401) { // unauthorized
            $rootScope.$broadcast('event:auth-loginRequired');
            return $q.reject(response);
        }

        // login failed for: //TEMPORARY
        if (response.status == 400) {
            $rootScope.$broadcast('event:auth-loginFailed', response.data.Message);
            return $q.reject(response);
        }

        // login failed for:
        if (response.status == 403) {
            $rootScope.$broadcast('event:auth-loginFailed', response.data.Message);
            return $q.reject(response);
        }

        if (response.status != 200) {
            //return $q.reject(response);
            throw response;
        }

        return $q.reject(response);
    }
}
RequestFactory.$inject = ["$q", "$rootScope", "Auth"];


function UserFactory($http, $q, apiurl, $cookieStore, appname){
    return {
        get : _getUser,
        set : _setUser,
        remove : _remove
    };

    function _setUser(){
        var defferred = $q.defer();
        //return $resource(authurl, {}, { login: { method: 'POST'}}).login(data).$promise;
        $http({

                method: 'GET',
                url: apiurl + '/me',
                data: [],
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }

            }).success(function (data, status, headers, config) {
                defferred.resolve(data);
            }).error(function (data, status, headers, config) {
                defferred.reject(data);
            });
            return defferred.promise;
    }
     function _getUser(){
        return JSON.parse($cookieStore.get(appname + '.User')) || false;
     }
     function _remove(){
        $cookieStore.remove(appname + '.User')
     }
}
//UserFactory.$inject = ["$http", "$q", "apiurl", "$cookieStore", "appname"];