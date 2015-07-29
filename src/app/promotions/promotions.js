angular.module( 'orderCloud.promotions',[] )

	.config( promotionsConfig )
	.controller( 'promotionsController', promotionsController )

;

function promotionsConfig( $stateProvider ) {
	$stateProvider.state( 'base.promotions', {
		url: '/promotions',
		resolve: {
			promotions : function(){
				return promotionsFactory.list();
			}
		},
		templateUrl:'promotions/templates/promotions.tpl.html',
		controller:'promotionsController',
		controllerAs: 'promotions',
		data:{ pageTitle: 'Promotions' }
	});
}

function promotionsController(promotions) {
	console.log(promotions);
	var vm = this;
	vm.example = 'Example Data';
}

function promotionsFactory($http, $q, apiurl){
	var UFid="Promotions", pageSize = 10, page = 1;
	return {
		list : _list,
		get : _get,
		put : _put
	};

	function _list(){
		var defferred = $q.defer();
		$http({
			 method: 'GET',
                url: apiurl + '/UserFields?pageSize='+pageSize+'&serach='+UFid+"&page="+page,
                headers: {
                    'Content-Type': 'data/JSON'
                }
		}).success(function(data, status, headers, config){
			defferred.resolve(data);
		}).error(function(data, status, headers, config){
			defferred.reject(data);
		});
		return defferred.promise;
	};
	function _get(){
		var defferred = $q.defer();
		$http({
			 method: 'GET',
                url: apiurl + '/me',
                data: [],
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
		}).success(function(data, status, headers, config){
			defferred.resolve(data);
		}).error(function(data, status, headers, config){
			defferred.reject(data);
		});
		return defferred.promise;
	};
	function _put(){
		var defferred = $q.defer();
		$http({
			 method: 'GET',
                url: apiurl + '/me',
                data: [],
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
		}).success(function(data, status, headers, config){
			defferred.resolve(data);
		}).error(function(data, status, headers, config){
			defferred.reject(data);
		});
		return defferred.promise;
	};
}