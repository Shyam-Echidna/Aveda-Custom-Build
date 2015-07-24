angular.module( 'orderCloud.myusers', [] )

	.config( MyusersConfig )
	.controller( 'MyusersCtrl', MyusersController )
	.factory('MyusersFact',MyusersFactory)

;

function MyusersConfig( $stateProvider ) {
	$stateProvider.state( 'base.myusers', {
		url: '/myusers',
		templateUrl:'myUsers/templates/myusers.tpl.html',
		controller:'MyusersCtrl',
		controllerAs: 'myusers',
		data:{ pageTitle: 'Myusers' },
        resolve:{
            myUsersDetails : function(MyusersFact){
             return MyusersFact.getUsers();
            }
        }
	});
}

function MyusersController(myUsersDetails) {

	var vm = this;
    vm.myusers = myUsersDetails.Items;
	
}

function MyusersFactory($http,$q){

        return {
          
            getUsers: function() {
                var deferred = $q.defer();
                $http({ method: "GET", 
                	url: "https://testapi.ordercloud.io/v1/buyers/1/users" })
                    .success(function (data, status, headers, config) {
                    	
                        deferred.resolve(data);
                    }).error(function (data, status, headers, config) {
                        deferred.reject(data);
                    });
                return deferred.promise;
            }
        };
}
