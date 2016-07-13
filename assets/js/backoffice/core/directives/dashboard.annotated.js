var winwidth = $(window).width()
var col=24;
if(winwidth <=1024){
    console.log('winwidth <=1024');
    col=12
}
if(winwidth <=800){
    // console.log('winwidth <=800');
    // col=6
}

angular.module('core').run(['gridsterConfig', function(gridsterConfig) {
    gridsterConfig.columns = col; // the width of the grid, in columns
    gridsterConfig.pushing = true; // whether to push other items out of the way on move or resize
    gridsterConfig.floating = true; // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
    gridsterConfig.swapping = false; // whether or not to have items of the same size switch places instead of pushing down if they are the same size
    gridsterConfig.width = 'auto'; // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
    gridsterConfig.colWidth = 'auto'; // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
    gridsterConfig.rowHeight = 'match'; // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
    gridsterConfig.margins = [20, 20]; // the pixel distance between each widget
    gridsterConfig.outerMargin = true; // whether margins apply to outer edges of the grid
    gridsterConfig.isMobile = false; // stacks the grid items if true
    gridsterConfig.mobileBreakPoint = 600; // if the screen is not wider that this, remove the grid layout and stack the items
    gridsterConfig.mobileModeEnabled = true; // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
    gridsterConfig.minColumns = 1; // the minimum columns the grid must have
    gridsterConfig.minRows = 2; // the minimum height of the grid, in rows
    gridsterConfig.maxRows = 100;
    gridsterConfig.defaultSizeX = 6; // the default width of a gridster item, if not specifed
    gridsterConfig.defaultSizeY = 4; // the default height of a gridster item, if not specified
    gridsterConfig.minSizeX = 1; // minimum column width of an item
    gridsterConfig.maxSizeX = null; // maximum column width of an item
    gridsterConfig.minSizeY = 1; // minumum row height of an item
    gridsterConfig.maxSizeY = null; // maximum row height of an item
    gridsterConfig.resizable = {
        enabled: false,
        // handles: ['se','nw','sw','ne'],
        handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
    };
    gridsterConfig.draggable = {
        enabled: false,
    };

}]);



angular.module('core')
  .directive('dashboard',["widgetService", "$compile", function (widgetService,$compile){
    'use strict';

    return {
      scope: {widgetlist:'='},
      replace: true,
      templateUrl: 'js/backoffice/core/partials/dashboard.html',
      controller:["$scope", "$element", "$attrs", "$transclude", "$rootScope", "$state", "usSpinnerService", "genie", function($scope,$element,$attrs,$transclude,$rootScope,$state,usSpinnerService,genie){
        $rootScope.startSpin = function(){
            usSpinnerService.spin('mainSpinner');
        }
        $rootScope.stopSpin = function(){
            setTimeout(function(){
                
            usSpinnerService.stop('mainSpinner');
            },500)
        }
        console.log('DASHBOARD');

        $scope.widgetList = $scope.widgetlist;
        // this.test ="yopaaa";
        $scope.columnwidth = 0;
        $scope.columnheight = 0;
          
        // $scope.testtest = function(t){
        //     console.log('totototototootototototototo');
        //     console.log(t);
        // }

        $scope.initSwipe =function(to,from){
            // if(to.parent == 'dashboard' )
            // {
            //     $('.pageDash').addClass('pageVisible').removeClass('pageAfter');
            //     $('.page1').addClass('pageAfter').removeClass('pageVisible');
            // }

        

        }
        $scope.swipe =function(to,from){
            var toViewName = _.map(to.views,function(value,key){ return key;})
            toViewName = toViewName[0];
            if(!from){
                if(to.name == 'dashboard' )
                {
                    $('.pageDash').addClass('pageVisible').removeClass('pageAfter pageBefore');
                    $('.page1').addClass('pageAfter').removeClass('pageVisible pageBefore');
                    $('.page2').addClass('pageAfter').removeClass('pageVisible pageBefore');
                }else 
                if(to.parent == 'dashboard' )
                {
                    $('.pageDash').addClass('pageBefore').removeClass('pageVisible pageAfter');
                    $('.page1').addClass('pageVisible').removeClass('pageAfter pageBefore');
                    $('.page2').addClass('pageAfter').removeClass('pageVisible pageBefore');
                }
                else 
                {
                    $('.pageDash').addClass('pageBefore').removeClass('pageVisible pageAfter');
                    $('.page1').addClass('pageBefore').removeClass('pageVisible pageAfter');
                    $('.page2').addClass('pageVisible').removeClass('pageAfter pageBefore');
                }
            }
            else{
                var fromViewName = _.map(from.views,function(value,key){ return key;})
                fromViewName = fromViewName[0];

                if(fromViewName == toViewName && 'page1' == fromViewName && from.name != to.name)
                {
                        $('.pageDash').addClass('pageVisible').removeClass('pageAfter pageBefore');
                        $('.page1').addClass('pageAfter').removeClass('pageVisible pageBefore');
                        $('.page2').addClass('pageAfter').removeClass('pageVisible pageBefore');

                        setTimeout(function(){
                            $('.pageDash').addClass('pageBefore').removeClass('pageVisible pageAfter');
                            $('.page1').addClass('pageVisible').removeClass('pageAfter pageBefore');
                            $('.page2').addClass('pageAfter').removeClass('pageVisible pageBefore'); 
                      

                        },500)


                }else{
                    if(to.name == 'dashboard' )
                    {
                        $('.pageDash').addClass('pageVisible').removeClass('pageAfter pageBefore');
                        $('.page1').addClass('pageAfter').removeClass('pageVisible pageBefore');
                        $('.page2').addClass('pageAfter').removeClass('pageVisible pageBefore');
                    }else 
                    if(to.parent == 'dashboard' )
                    {
                        $('.pageDash').addClass('pageBefore').removeClass('pageVisible pageAfter');
                        $('.page1').addClass('pageVisible').removeClass('pageAfter pageBefore');
                        $('.page2').addClass('pageAfter').removeClass('pageVisible pageBefore');
                    }
                    else 
                    {
                        $('.pageDash').addClass('pageBefore').removeClass('pageVisible pageAfter');
                        $('.page1').addClass('pageBefore').removeClass('pageVisible pageAfter');
                        $('.page2').addClass('pageVisible').removeClass('pageAfter pageBefore');
                    }
                }

            }


        }
       
        // $scope.swipeback =function(){
        //   $('.pageVisible').addClass('pageAfter').removeClass('pageVisible');
        //   // $('.pageAfter').addClass('pageVisible').removeClass('pageAfter');
        //   $('.pageBefore').addClass('pageVisible').removeClass('pageBefore');
        // }
        
        $scope.swipe($state.current)
        // $scope.$on('$viewContentLoading',function(e,t){
        //   if($state.current.name != "dashboard")
        //     $scope.swipe()
          
          
        // });
        $scope.$on('$stateChangeSuccess',function (e,toState,toParams,fromState,fromParams){
            $rootScope.previousState = fromState;
            $rootScope.previousStateParams = fromParams;

            $scope.swipe(toState, fromState)

            
        });
       
        // INIT FIRST SWIPE IF view is on right page
        // if($state.current.name != "dashboard")
        //   $scope.swipe()
        // $scope.$on('$stateChangeSuccess',function(e,t){
     
          
          
        // });
        $scope.demoContext = 'genie-demo';
        $scope.iconPrefix = 'fa fa-';
        genie.context($scope.demoContext);
        var magicWords ='';
        var datatest ={icon:'home'};
        // genie({
        //     magicWords: ['Ajouter un utilisateur','add user','add utilisateur'],
        //     action: function(wish) {
        //       alert('Your "' + wish.magicWords[0] + '" wish is my command!');
        //     },
        //     context: $scope.demoContext,
        //     data: {
        //       uxGenie: {
        //         iIcon: 'fa fa-user'
        //       }
        //     }
        // });
genie.context('global')
        genie({
            magicWords: ['Utilisateurs','liste des utilisateurs'],
            action: function(wish) {
              $state.go('users')
            },
            context: 'global',
            data: {
              uxGenie: {
                iIcon: 'fa fa-users'
              }
            }
        });
        genie({
            magicWords: ['Ajouter un utilisateur','add user','add utilisateur'],
            action: function(wish) {
                $state.go('users',{'pseudostate':'add'})
            },
            context: 'global',
            data: {
              uxGenie: {
                iIcon: 'fa fa-user-plus',
              }
            }
        });
        genie({
            magicWords: ['Categories','liste des categories'],
            action: function(wish) {
                $state.go('categories')
            },
            context: 'global',
            data: {
              uxGenie: {
                iIcon: 'pe-7f-way',
              }
            }
        });
        genie({
            magicWords: ['Tags','liste des tags'],
            action: function(wish) {
                $state.go('tags')
            },
            context: 'global',
            data: {
              uxGenie: {
                iIcon: 'fa fa-tags',
              }
            }
        });
        genie({
            magicWords: ['Entrer/Sortir du mode edition','edit dashboard','edition du dashboard','mode edition','widget'],
            action: function(wish) {
                
                $scope.$broadcast('EnterEditMode','true');
            },
            context: 'global',
            data: {
              uxGenie: {
                iIcon: 'pe-7f-tools',
              }
            }
        });
        genie({
            magicWords: ['Enregistrer le dashboard','save dashboard','Sauvegarder le dashboard','widget'],
            action: function(wish) {
                
                $scope.$broadcast('saveDashBoard','true');
            },
            context: 'global',
            data: {
              uxGenie: {
                iIcon: 'pe-7f-diskette',
              }
            }
        });
        genie({
            magicWords: ['Articles','liste article'],
            action: function(wish) {
                
                $state.go('blog')
            },
            context: 'global',
            data: {
              uxGenie: {
                iIcon: 'pe-7f-note',
              }
            }
        });
        genie({
            magicWords: ['Ajouter un article','add article'],
            action: function(wish) {
                
                 $state.go('blog.add')
            },
            context: 'global',
            data: {
              uxGenie: {
                iIcon: 'pe-7f-note',
              }
            }
        });
        genie({
            magicWords: ['Projets','liste projets','grimpe'],
            action: function(wish) {
                
                $state.go('projects')
            },
            context: 'global',
            data: {
              uxGenie: {
                iIcon: 'pe-7f-note',
              }
            }
        });
        genie({
            magicWords: ['Ajouter un projet','add project','add grimpe'],
            action: function(wish) {
                
                 $state.go('projects.add')
            },
            context: 'global',
            data: {
              uxGenie: {
                iIcon: 'pe-7f-display2',
              }
            }
        });
        genie({
            magicWords: ['Mon profile','modifier profile','edit profile'],
            action: function(wish) {
                
                 $state.go('profile')
            },
            context: 'global',
            data: {
              uxGenie: {
                iIcon: 'pe-7f-tools',
              }
            }
        });
        genie({
            magicWords: ['Déconnexion','deconnexion','lot out','logout'],
            action: function(wish) {
                
                 $state.go('logout')
            },
            context: 'global',
            data: {
              uxGenie: {
                iIcon: 'pe-7f-power',
              }
            }
        });
        genie({
            magicWords: ['Changer de thème','Theme','change theme'],
            // action: function(wish) {
                
            //      // $rootScope.$broadcast('changeTheme',$scope.currentTheme);
            // },
            context: 'global',
            data: {
              uxGenie: {
                subContext: ['theme'],
                iIcon: 'pe-7f-tools',
              }
            }
        });
        genie({
            magicWords: ['Normal','Default','Bleu','1'],
            action: function(wish) {
                
                 $scope.$broadcast('geniechangeTheme','bg1');
                 // $rootScope.$broadcast('changeTheme','bg1');
            },
            context: 'theme',
            data: {
              uxGenie: {
                // iIcon: 'pe-7f-power',
              }
            }
        });
        genie({
            magicWords: ['Rouge','red','rose','3'],
            action: function(wish) {
                
                 $scope.$broadcast('geniechangeTheme','bg3');
                 // $rootScope.$broadcast('changeTheme','bg3');
            },
            context: 'theme',
            data: {
              uxGenie: {
                // iIcon: 'pe-7f-power',
              }
            }
        });
        genie({
            magicWords: ['Orange / Violet','violet','orange','2'],
            action: function(wish) {
                
                 $scope.$broadcast('geniechangeTheme','bg2');
                 // $rootScope.$broadcast('changeTheme','bg3');
            },
            context: 'theme',
            data: {
              uxGenie: {
                // iIcon: 'pe-7f-power',
              }
            }
        });
        genie({
            magicWords: ['Vert','green','nature','4'],
            action: function(wish) {
                
                 $scope.$broadcast('geniechangeTheme','bg4');
                 // $rootScope.$broadcast('changeTheme','bg3');
            },
            context: 'theme',
            data: {
              uxGenie: {
                // iIcon: 'pe-7f-power',
              }
            }
        });

        genie({
            magicWords: ['Afficher un widget','show widget'],
            action: function(wish) {
                
                 // $scope.$broadcast('geniechangeTheme','bg4');
                 // $rootScope.$broadcast('changeTheme','bg3');
            },
            context: 'global',
            data: {
              uxGenie: {
                subContext: ['showwidget'],
                iIcon: 'pe-7f-tools',
              }
            }
        });
        genie({
            magicWords: ['Masquer un widget','hide widget','cacher un widget'],
            action: function(wish) {
            },
            context: 'global',
            data: {
              uxGenie: {
                subContext: ['hidewidget'],
                iIcon: 'pe-7f-tools',
              }
            }
        });
        for(var i in widgetService.list){
            if(!widgetService.list[i].required){
                genie({
                    magicWords: [widgetService.list[i].publicName],
                    action: function(wish) {
                         widgetService.list[wish.data.indexOf].enabled = false
                    },
                    context: 'hidewidget',
                    data:{
                        indexOf: i 
                    }
                });
                genie({
                    magicWords: [widgetService.list[i].publicName],
                    action: function(wish) {
                         widgetService.list[wish.data.indexOf].enabled = true
                    },
                    context: 'showwidget',
                    data:{
                        indexOf: i 
                    }
                });
            }
        }


      }],
      link:function(scope,element,attrs){

        setTimeout(function(){
          console.log('timeout');

          console.log(scope);

        },7000)

        console.log(scope.$parent.$parent.$parent);
          
          scope.$on('restoreDefault',function(e,theme){
            scope.widgetList = widgetService.defaultList;
          })
            

          scope.$on('gridster-resizable-changed', function(e,gridster) {
            scope.columnwidth = gridster.curColWidth -20;
            scope.columnheight = gridster.curRowHeight -20;

            // console.log(scope);
            // var col = 24
            // if(winwidth <=1024){
            //     console.log('winwidth <=1024');
            //     col=16
            // }
            // // scope.gridster.draggable.enabled = true;
            // gridster.columns = col;


            console.log('GRIDSTER RESIZE CHANGE-----');
            
          })
          
          scope.$on('gridster-resize', function(gridster) {

            console.log('GRIDSTER RESIZE LINK DASHBOARD');


          })


      }
    };

}]);