angular.module( 'orderCloud.news', [] )

	.config( NewsConfig )
	.factory('NewsService', NewsService)
	.controller( 'NewsListCtrl', NewsListController )
;

function NewsConfig( $stateProvider ) {
	$stateProvider
		.state( 'base.news', {
			url: '/news',
			templateUrl:'news/templates/news.list.tpl.html',
			data:{ pageTitle: 'Administer News' },
			controller: 'NewsListCtrl',
			controllerAs: 'newsList',
			resolve:{
				newsDetails: function(NewsService){
				return NewsService.List();
				}
			}
			
		})
		
	;
}

function NewsService( $q, $http ) {
	var service = {
		Get: _get,
		List: _list
	};

	function _get(id) {
		
	}

	function _list() {

		var deferred = $q.defer();
                $http({ method: "GET", 
                	url: "https://testapi.ordercloud.io/v1/UserFields?search=News" })
                    .success(function (data, status, headers, config) {
                    	
                        deferred.resolve(data);
                    }).error(function (data, status, headers, config) {
                        deferred.reject(data);
                    });
                return deferred.promise;
	}

	
	return service;
}

function NewsListController( newsDetails ) {
	
	var vm = this;
	vm.articles = [];
	angular.forEach(newsDetails.Items, function(f) {
				f.Article = JSON.parse(f.DefaultValue);
					vm.articles.push(f);

			});
		
}

