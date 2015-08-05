angular.module('orderCloud.browse', [])
	.config( BrowseConfig )
	.directive('avedaBrowse', avedaBrowseDirective)
	.controller('avedaBrowseCtrl', avedaBrowseController)
	.controller('newcontrl', newcontrlController)
	.controller('prodDetailcontrl', prodDetailController)
	.factory('BrowseFact',BrowseFactory)

.directive('stopEvent', function () { return { restrict: 'A', link: function (scope, element, attr) { element.bind('click', function (e) { e.stopPropagation(); }); } }; });
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
			templateUrl:'browse/templates/categoryListing.tpl.html',
			controller:'newcontrl',
			controllerAs:'newbrowse'
			
		})
		.state( 'base.productList', {
			url: '/productList/:id',
			data:{ pageTitle: 'product listing' },
			templateUrl:'browse/templates/productListing.tpl.html',
			controller:'newcontrl',
			controllerAs:'newbrowse'
			
		})
		.state( 'base.productDetail', {
			url: '/productDetail/:id',
			data:{ pageTitle: 'product listing' },
			templateUrl:'browse/templates/productDetail.tpl.html',
			controller:'prodDetailcontrl',
			controllerAs:'prodDetail'
			
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
function prodDetailController($stateParams, BrowseFact){
	var vm = this;
	BrowseFact.getProd($stateParams.id).then(function(items){
          	vm.prodDetails = items;
          	console.log(vm.prodDetails);
          })

}
function newcontrlController($state, $stateParams, BrowseFact, lodash, $modal, $rootScope){
	var vm = this;
	BrowseFact.getAll().then(function (items) {
		categories = unflatten(items.Items);
		vm.catDetails = feachele(categories, $stateParams.id);
    console.log(vm.catDetails);
		
		if(!vm.catDetails.children.length){
			
			$state.go('base.productList',{id: $stateParams.id});
		}
		/*for(var i=0;i<categories.length;i++){
			if(categories[i].ID == $stateParams.id){				
				vm.catDetails = categories[i];
				console.log(vm.catDetails);
				break;
			}
		}*/
	});
	BrowseFact.List($stateParams.id).then(function(items){
		console.log(items);
		vm.products = items;
	});

	vm.open = function (id,$event) {
		
		 $event.stopPropagation();
		 $event.preventDefault();
		/* $rootScope.$on('$stateChangeStart',
			function(event, toState, toParams, fromState, fromParams){
			  event.preventDefault();
			   console.log(event);
			})*/
		
    var modalInstance = $modal.open({
      animation: true,
      templateUrl: 'browse/templates/quickView.tpl.html',
      size : 'lg',
      controller: function($modalInstance, productData){
      	var vm = this;
      	vm.productInfo = productData;
      	vm.close = function(){$modalInstance.dismiss('cancel');};
      },
      controllerAs : "productInf",
      resolve: {
        productData: function (BrowseFact) {
          return BrowseFact.getProd(id).then(
          function(success){
          	return success;
          },
          function(error){
          	return false;
          })
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      //$log.info('Modal dismissed at: ' + new Date());
    });
  };
	
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
	BrowseFact.getAllProducts().then(function (Products) {
	console.log(Products);
	vm.productsList = Products.Items;
	});
	
}
function BrowseFactory($http,$q){
var service = {
		getAll: _get,
		List: _list,
		getProd : _getProduct,
		getAllProducts :_getAllProducts
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
							/*var promise = $http({ method: "GET", 
                			url: "https://testapi.ordercloud.io/v1/products/"+prodArr[i] });
							*/
							var promise = _getProduct(prodArr[i]);
							ajaxarr.push(promise);
							console.log(promise);
						}
                    	
                    	
                    	$q.all(ajaxarr).then(function(items){						
						deferred.resolve(items);
						});
                        
                    }).error(function (data, status, headers, config) {
                        deferred.reject(data);
                    });
                return deferred.promise;

			}

			function _getProduct(productID){				
				var deferred = $q.defer();
				var StandardPriceSchedule;
					$http({ method: "GET", 
                	url: "https://testapi.ordercloud.io/v1/products/assignments?productID="+productID,
                	cache: true })
                    .success(function (data, status, headers, config) {
                    	
                    	var StandardPriceScheduleID = data.Items[0].StandardPriceScheduleID;
                    	$http({ method: "GET", 
                	url: "https://testapi.ordercloud.io/v1/priceschedules/"+StandardPriceScheduleID,
                	cache: true })
                    .success(function (data, status, headers, config) {
                    	StandardPriceSchedule = data;                    	
                   $http({ method: "GET", 
                	url: "https://testapi.ordercloud.io/v1/products/"+productID,
                	cache: true })
                    .success(function (data, status, headers, config) {
                    	data["StandardPriceSchedule"] = StandardPriceSchedule;
                   	 deferred.resolve(data)
                        
                    }).error(function (data, status, headers, config) {
                        deferred.reject(data);
                    });
                        
                    }).error(function (data, status, headers, config) {
                      //  deferred.reject(data);
                    });

                   	 //deferred.resolve(data)
                        
                    }).error(function (data, status, headers, config) {
                       // deferred.reject(data);
                    });


				return deferred.promise;
			}
			 function _getAllProducts() {
               var deferred = $q.defer();
               $http({ method: "GET", 
               	url: "https://testapi.ordercloud.io/v1/Products?search=Lotion" })
                   .success(function (data, status, headers, config) {
                   	
                       deferred.resolve(data);
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
    function feachele(arr, id){
    for(var i=0;i<arr.length;i++){
        if(arr[i].ID == id){
        return  arr[i];
           
        }
        var childarr = arr[i].children;
        if(childarr.length){
            for(var j=0;j<childarr.length;j++){
                if(childarr[j].ID == id){
                return  childarr[j];
                  
                }
                var subchildarr = childarr[j].children;
                if(subchildarr.length){
                   
                for(var k=0;k< subchildarr.length;k++){
                if(subchildarr[k].ID == id){
                return subchildarr[k];
                    
                }
                }
                }
            }
        }
    }    
}