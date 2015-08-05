angular.module( 'orderCloud.myusers', [] )

	.config( MyusersConfig )
	.controller( 'MyusersCtrl', MyusersController )
    .factory('MyusersFact',MyusersFactory)
	.factory('myCache',myCache)

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
function myCache($cacheFactory)  {

     return $cacheFactory('myData');
}
function MyusersController(myUsersDetails, $cacheFactory) {
console.log("myUsersDetails",myUsersDetails);
	var vm = this;
    vm.myusers = myUsersDetails.Items;
	/*var myCache = $cacheFactory.get('$http');
    console.log("myCache===",myCache);
    console.log("myCache===",myCache.get("https://testapi.ordercloud.io/v1/buyers/1/users"));
    console.log("myCache===",myCache.get("https://testapi.ordercloud.io/v1/buyers/2/categories/productassignments?categoryID=_pgtwwnsRky5X3zwuKwqRw"));*/
}

function MyusersFactory($http,$q,$cacheFactory, myCache,buyer){

        return {
          
            getUsers: function() {
                var cache = myCache.get('myData');
                   if (cache) {
                    console.log('if');
                    return cache;
                   }
                   else{
                    console.log('else');
                var deferred = $q.defer();              
                $http({ method: "GET",                    
                	url: "https://testapi.ordercloud.io/v1/buyers/"+buyer+"/users", 
                    cache: true
                })
                    .success(function (data, status, headers, config) {
                    	 myCache.put('myData', data);
                        deferred.resolve(data);
                    }).error(function (data, status, headers, config) {
                        deferred.reject(data);
                    });
                return deferred.promise;
            }
            }
        };
}
