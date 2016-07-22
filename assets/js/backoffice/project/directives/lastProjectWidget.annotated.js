angular.module('core')
  .directive('lastprojectWidget', ["widgetService", "projectService", "$state", function (widgetService,projectService,$state){

    'use strict';
    var thisresize = function(item){


        	var classToSet= 'style0' ,classFont='mediumFont';
        	var x = item.sizeX, y = item.sizeY;

            if(y < 2){
               classToSet = 'style0'; 
           }else
           if(y == 2){
                classToSet= 'style0';
           }else
           if(y == 3){
                classToSet= 'style2';
                if(x <=4){
                    classToSet= 'style0';

                }
           }else
           if(y >= 4){
                classToSet= 'style1';
                if(x <=4){
                    classToSet= 'style0';
                }
           }
           if(y >= 7){
               
                    classToSet= 'style0';
           }
           if(x == 5){
                if(y >= 5){
                    classToSet= 'style0';
                }
           }
        // if(x < 5)
        //   {
        //       classToSet = 'style0';
        //   }else
        //   if(x >= 5 && x < 7)
        //   {
        //         if(y < 5){
        //             classToSet = 'style1';

        //         }else
        //         {
        //             classToSet = 'style4';
        //         }
        //   }else
        //   if(x >= 8 && x < 12)
        // 	{
        //         if(y < 4){
        // 			classToSet = 'style2';

        //         }else
        //         {
        //             classToSet = 'style3';
        //         }
        // 	}else
        //   {
        //       classToSet = 'style0';
        //   }
  
        	
    //     	if(x > 3 && x <= 5 && y <=4)
    //     	{
				// 	classToSet = 'style6';
				// 	classFont='extralargeFont';
    //     	}
    //     	if(y ==1)
    //     	{
	   //      	if(x <= 3)
	   //      	{
				// 		classToSet = 'style0';
				// 		classFont='mediumFont';
	   //      	}
	   //      	if(x > 3)
	   //      	{
				// 		classToSet = 'style7';
				// 		classFont='mediumFont';
	   //      	}
	   //      	if(x > 5)
	   //      	{
				// 		classToSet = 'style8';
				// 		classFont='mediumFont';
	   //      	}
	   //      	if(x > 8)
	   //      	{
				// 		classToSet = 'style9';
				// 		classFont='largeFont';
	   //      	}
    //     	}
    
    $('.lastprojectWidget .RESIZEHEIGHT').height(item.getElementSizeY()-94)
    setTimeout(function(){
      
      $('.lastprojectWidget .RESIZEHEIGHT md-card-title-text').getNiceScroll().resize();
      $('#noLastProjectElment').css('height' , item.getElementSizeY()-94 +'px')
      $('.card-media ').height(item.getElementSizeY()-125)
      $('.card-media ').width(item.getElementSizeY()-125)
    },1)
        	
        	item.$element.removeClass('style0 style1 style2 style3 style4 style5 style6 style7 style8 style9 style10 style11 style12 style13 style14 style15 smallFont extralargeFont mediumFont  largeFont')
        	.addClass(classToSet+ ' ' + classFont)
        	.addClass('lastprojectWidget')
    	
    }
    return {
      scope: {},
      replace: true,
      templateUrl: 'js/backoffice/project/partials/lastProjectWidget.html',
      controller:["$scope", "projectService", "$state", function($scope,projectService,$state){
            $scope.editProjectState=function(id){
                
                $state.go('dashboard/projects/edit',{id:id})
            }
             $scope.optionScroll = {
              cursorcolor:'#FFFFFF',
              cursoropacitymin: 0, // change opacity when cursor is inactive (scrollabar "hidden" state), range from 1 to 0
              cursoropacitymax: 0.3,
              cursorborder:'none',
              railoffset: {left:8}
            }
      }],
      link:function(scope,element,attrs){


      		
      	thisresize(scope.$parent.gridsterItem)

        projectService.fetchLast().then(function(data){
          scope.lastProject = data;
          scope.$applyAsync()
        }).catch(function(e){
        })


      	scope.$parent.$on('gridster-item-resized', function(e,item) {
      		thisresize(item)

      		
		    })
      	scope.$parent.$on('gridster-item-transition-end', function(e,item) {

      		// widgetService.changeDash(scope.widgetList);
		    // sizes[0] = width
		    // sizes[1] = height
		    // gridster.
		    })

      }
    };

}]);