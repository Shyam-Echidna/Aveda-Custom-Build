angular.module( 'orderCloud.salons',[] )

	.config( salonsConfig )
	.controller( 'salonsController', salonsController )
	.filter( 'dash', dashFilter )
	.factory( 'salonFact', salonFactory )

;

function salonsConfig( $stateProvider ) {
	$stateProvider.state( 'base.salons', {
		url: '/salons',
		resolve: {
			salonDetails : function(salonFact){
				return salonFact.getSalonDetails().then(function(salones){
					return salones['Items'];
				});
			}
		},
		templateUrl:'salons/templates/salons.tpl.html',
		controller:'salonsController',
		controllerAs: 'salons',
		data:{ pageTitle: 'Salones' }
	});
}

function salonsController(salonDetails) {
	var vm = this;
	vm.salonDetails = salonDetails;
}

function salonFactory($q, apiurl, buyer, $http){

	return {
		getSalonDetails : _getSalonDetails
	};

	function _getSalonDetails(){
		var deferred = $q.defer();
		$http({ 
			method: "GET",                    
           	url: apiurl + "/buyers/" + buyer +"/groups?search=salon", 
            cache: true
        }).success(function (data, status, headers, config) {
            	deferred.resolve(data);
           }).error(function (data, status, headers, config) {
            	deferred.reject(data);
           });
      	return deferred.promise;
	}
}