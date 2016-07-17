angular.module('momi-params')
  .directive('paramsList', function (articleService,paramsService){

    'use strict';

    return {
      
      	scope: {
      		version:'=',
      		dbstats:'=',
      		stockage:'=',
      	},
		replace: true,
		templateUrl: 'js/backoffice/params/partials/paramsList.html',
		controller:function($scope,$rootScope,userService,$filter,articleService,paramsService,tagService,imageService,documentService,$sailsSocket,$stateParams,$state,usSpinnerService){
			$scope.returnParentState=function(){
				$state.go('^')
			}
			$scope.returnPreviousState=function(){
				if($rootScope.previousState){
					$state.go($rootScope.previousState.name, $rootScope.previousStateParams)
				}else{
					$state.go('^')
				}
			}
			$scope.returnDashboardState=function(){
				$state.go('dashboard')
			}
			$scope.sizequota=paramsService.sizequota;
			$scope.myversion=$scope.version;
			$scope.dbstats=$scope.dbstats;
			console.log($scope.dbstats);
			$scope.imageSize=Number($scope.stockage.totalImage);
			$scope.fileSize=Number($scope.stockage.totalFile);
			$scope.depassement= Number(($scope.imageSize+$scope.fileSize)-$scope.sizequota)
			$scope.freespace= Number($scope.sizequota-($scope.imageSize+$scope.fileSize))
			

			var freespace = $filter('bytes')(Number($scope.freespace))
			var fileSize = $filter('bytes')(Number($scope.fileSize))
			var imageSize = $filter('bytes')(Number($scope.imageSize))
			$scope.data2 = [$scope.imageSize,$scope.fileSize,$scope.freespace]
		    $scope.colors =  ['#2364ba','#f27d1d','#5cb85c'];
		// console.log($filter('bytes')($scope.imageSize));

		    $scope.labels2 = ['Images','Documents','Espace libre'];
		    $scope.options2 = {
		    	showTooltips: false,
		    }

		    $scope.restartSite = function() {

		    	$rootScope.startSpin();
		    	console.log('scope restartSite');
		    	paramsService.restartSite().then(function succ(d) {
		    		$rootScope.stopSpin()
		    		// messageCenterService.add('success', d, { status: messageCenterService.status.next ,timeout: 3000});
		    	},function err(d) {
		    		console.log('ERR')
		    		console.log(d)

		    	})

		    };


		},
		link:function(scope,element,attrs){
			
		}
    };

});