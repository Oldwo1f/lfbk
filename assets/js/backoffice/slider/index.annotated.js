angular.module('momi-sliders', ['ui.router','angular-carousel'])
.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider){
    	
    	$stateProvider
	    .state('sliders', {
	        url : '/sliders',
	        params:{
	        	sort:'date DESC',
	        	page:1,
	        	nbPerPage : 10
	    	},
	        parent:'dashboard',
	        views:{
	        	'page1': {
	        		template: '<sliders slideshow-list="slidersList"></sliders>',
	        		controller:["$scope", "slidersList", function($scope,slidersList){
	        			console.log('CTRL');
	        			console.log(slidersList);
	        			$scope.slidersList = slidersList;
	        		}],
	        		resolve:{
	                    slidersList :  ["sliderService", "$stateParams", function(sliderService, $stateParams){
	                        
	                        console.log('RESOLVE');

	                        // return 'toto'
	                        return sliderService.fetch($stateParams.sort,$stateParams.page,$stateParams.nbPerPage)
	                    }]
	                }
	        	}

	        }
	        // views:{
	        // 	'page1': {
	        // 		template: '<blog articles-list="articlesList"></blog>',
	        // 		controller:function($scope, articlesList){
	        // 			$scope.articlesList = articlesList;
	        // 		},
	        // 		resolve:{
	        //             articlesList :  function(articleService, $stateParams){
	                        

	        //                 return articleService.fetch($stateParams.sort,$stateParams.page,$stateParams.nbPerPage)
	        //             }
	        //         }
	        // 	}

	        // }
       	})

      
}]);
