angular.module('orderCloud.browse', [])
	.config( BrowseConfig )
	.directive('avedaBrowse', avedaBrowseDirective)
	.controller('avedaBrowseCtrl', avedaBrowseController)
	.controller('newcontrl', newcontrlController)
	.factory('BrowseFact',BrowseFactory)
;
function BrowseConfig( $stateProvider ) {
	$stateProvider
		.state( 'base.browse', {
			url: '/browse',
			data:{ pageTitle: 'Administer browse' },
			template:'<h1>reddy</h1>',
			controller:'avedaBrowseCtrl',
			controllerAs:'browse'
			
		})
		.state( 'base.detail', {
			url: '/detail/:id',
			data:{ pageTitle: 'Administer browse' },
			templateUrl:'browse/templates/productListing.tpl.html',
			controller:'newcontrl',
			controllerAs:'newbrowse'
			/*resolve: {
				NewsItem: function( $state, $stateParams, BrowseFact ) {
					console.log($stateParams);
					return BrowseFact.List($stateParams.id)
						.then(function(article) {
							return article;
						})
						
				}
			}*/
		})
	;
}
function avedaBrowseDirective() {
	var obj = {
		restrict:'E',
		templateUrl:'browse/templates/browse.directive.tpl.html',
		controller: 'avedaBrowseCtrl',
		controllerAs: 'browse',
		replace:true
	};
	return obj;
}
function newcontrlController($stateParams, BrowseFact){
	var vm = this;
	console.log($stateParams);
	BrowseFact.getAll().then(function (items) {
		categories = unflatten(items.Items);
		for(var i=0;i<categories.length;i++){
			if(categories[i].ID == $stateParams.id){				
				vm.catDetails = categories[i];
				console.log(vm.catDetails);
				break;
			}
		}
	});
	BrowseFact.List($stateParams.id).then(function(items){
		console.log("items===",items);
		vm.products = items;
	})

}
function avedaBrowseController(BrowseFact, $rootScope) {
	
	var vm = this;
		vm.isOpen = false;

	vm.showSubs = function(cat) {
		if (cat.showSubs) cat.ShowSubs = true;
	};
	BrowseFact.getAll().then(function (items) {
		vm.cats = unflatten(items.Items);
	});
/*$rootScope.$on('$stateChangeStart',
function(event, toState, toParams, fromState, fromParams){
   // event.preventDefault();
    if(toState.name == "base.browse"){
    	alert('if');
    	vm.isOpen =!vm.isOpen;
    }
    else{
    	alert('else');
    }
    // transitionTo() promise will be rejected with
    // a 'transition prevented' error
})*/
	
}
function BrowseFactory($http,$q){
var service = {
		getAll: _get,
		List: _list
	};
      
          
            function _get() {
                var deferred = $q.defer();
                $http({ method: "GET", 
                	url: "https://testapi.ordercloud.io/v1/buyers/2/categories" })
                    .success(function (data, status, headers, config) {
                    	
                        deferred.resolve(data);
                    }).error(function (data, status, headers, config) {
                        deferred.reject(data);
                    });
                return deferred.promise;
            };
            function _list(id) {
				
				var deferred = $q.defer();
                $http({ method: "GET", 
                	url: "https://testapi.ordercloud.io/v1/buyers/2/categories/productassignments?categoryID="+id,
                	cache: true })
                    .success(function (data, status, headers, config) {
                    	prodArr = [];
                    	for(var i=0;i<data.Items.length;i++){
                    		prodArr.push(data.Items[i].ProductID);
                    	}
                    		ajaxarr = [];
							for(var i=0;i<prodArr.length;i++)
						{
							var promise = $http({ method: "GET", 
                			url: "https://testapi.ordercloud.io/v1/products/"+prodArr[i] });
							ajaxarr.push(promise);
						}
                    	
                    	
                    	$q.all(ajaxarr).then(function(items){						
						deferred.resolve(items);
						});
                        
                    }).error(function (data, status, headers, config) {
                        deferred.reject(data);
                    });
                return deferred.promise;

			}
           return service;
       
}

 function unflatten(arr) {
       
      var tree = [],
          mappedArr = {},
          arrElem,
          mappedElem;

      // First map the nodes of the array to an object -> create a hash table.
      for(var i = 0, len = arr.length; i < len; i++) {
        arrElem = arr[i];
        mappedArr[arrElem.ID] = arrElem;
        mappedArr[arrElem.ID]['children'] = [];
      }


      for (var ID in mappedArr) {
        if (mappedArr.hasOwnProperty(ID)) {
          mappedElem = mappedArr[ID];
          // If the element is not at the root level, add it to its parent array of children.
          if (mappedElem.ParentID) {
            mappedArr[mappedElem['ParentID']]['children'].push(mappedElem);
          }
          // If the element is at the root level, add it to first level elements array.
          else {
            tree.push(mappedElem);
          }
        }
      }
      return tree;
    }