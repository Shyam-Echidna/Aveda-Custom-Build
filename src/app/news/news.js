angular.module( 'orderCloud.news', [] )

	.config( NewsConfig )
	.factory('NewsService', NewsService)
	.controller( 'NewsListCtrl', NewsListController)
	.directive( 'newsWidget', NewsWidgetDirective )
	.controller( 'NewsWidgetCtrl', NewsWidgetController)
	.controller( 'NewsDetailCtrl', NewsDetailController)
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
		.state( 'base.newsdetail', {
			url: '/newsdetail/:id',
			templateUrl:'news/templates/news.detail.tpl.html',
			data:{ pageTitle: 'Administer News' },
			controller:'NewsDetailCtrl',
			controllerAs:'newsDetail',
		resolve: {
				NewsItem: function( $state, $stateParams, NewsService ) {
					return NewsService.Get($stateParams.id)
						.then(function(article) {
							console.log(article);
							return article;
						})
						.catch(function() {
							$state.go('base.news.list');
						})
				}
			}
		})
		
	;
}
function NewsWidgetDirective( ) {
	var directive = {
		restrict: 'E',
		templateUrl:'news/templates/news.widget.tpl.html',
		controller: 'NewsWidgetCtrl',
		controllerAs: 'newsWidget',
		replace:true
	};

	return directive;
}

function NewsWidgetController( NewsService) {
	var vm = this;
	vm.articles = [];
	
	 NewsService.List().then(function(data){
	 	vm.tmpArticles = data.Items;
	 	angular.forEach(vm.tmpArticles, function(f) {
				f.Article = JSON.parse(f.DefaultValue);
					vm.articles.push(f);

			});
	 });
	
	}
function NewsDetailController( NewsItem ) {	
	console.log(NewsItem);
	var vm = this;
	//vm.articles = [];
	vm.articles = JSON.parse(NewsItem.DefaultValue);
	/*angular.forEach(NewsItem.Items, function(f) {
				f.Article = JSON.parse(f.DefaultValue);
					vm.articles.push(f);

			});*/
}

function NewsService( $q, $http ) {
	var service = {
		Get: _get,
		List: _list
	};

	function _get(id) {
		var deferred = $q.defer();
                $http({ method: "GET", 
                	url: "https://testapi.ordercloud.io/v1/UserFields/"+id})
                    .success(function (data, status, headers, config) {
                    	
                        deferred.resolve(data);
                    }).error(function (data, status, headers, config) {
                        deferred.reject(data);
                    });
                return deferred.promise;
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

