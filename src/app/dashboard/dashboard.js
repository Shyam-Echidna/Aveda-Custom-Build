angular.module( 'orderCloud.dashboard', [] )

	.config( DashboardConfig )
	.controller( 'DashboardCtrl', DashboardController )
	.factory('DashboardFact',DashboardFactory)

;

function DashboardConfig( $stateProvider ) {
	$stateProvider.state( 'base.dashboard', {
		url: '/dashboard',
		templateUrl:'dashboard/templates/dashboard.tpl.html',
		controller:'DashboardCtrl',
		controllerAs: 'dashboard',
		data:{ pageTitle: 'Dashboard' }
	});
}

function DashboardController(DashboardFact) {

	var vm = this;
	DashboardFact.getAll().then(function (items) {
		console.log(items);
});
}

function DashboardFactory($http,$q){

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
