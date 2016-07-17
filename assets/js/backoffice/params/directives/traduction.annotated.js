angular.module('momi-blog')
.directive('traductions',function(){


	 return {
      	scope: {
      		traduction:'=',
      	},
      	replace: true,
      	templateUrl: 'js/backoffice/params/partials/traduction.html',
      	controller:["$scope", "$auth", "$state", "$stateParams", "paramsService", "$rootScope", function ($scope, $auth,$state,$stateParams,paramsService,$rootScope) {
			console.log('i18nCtrl');
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
		   	$scope.languages = paramsService.languages;
			console.log($scope.languages);
			console.log($scope.defaultLanguage);
			// $scope.traduction=traduction;
			$scope.lang=$stateParams.lang;
			console.log($scope.lang);
			$scope.save=function() {
				console.log('$scope.traduction',$scope.traduction);
				paramsService.saveTraduction($scope.lang,$scope.traduction).then(function() {
					// messageCenterService.add('success', 'Traduction "'+$scope.lang+'" enregistrée', { status: messageCenterService.status.next ,timeout: 3000});
				},function() {
					// messageCenterService.add('danger', 'Une erreur s\'est produite', { status: messageCenterService.status.next ,timeout: 3000});
				})
			};
			$scope.autoSave=function() {
				$rootScope.startSpin()
				console.log('$scope.traduction',$scope.traduction);
				paramsService.saveTraduction($scope.lang,$scope.traduction).then(function() {
					$rootScope.stopSpin()

				},function() {
				})
			};
			$scope.changelang =function () {

				console.log($scope.lang);
				$state.go('params.traductions',{lang:$scope.lang})
			};
		}],
		link:function(scope,element,attrs){
			
		}
    };

});