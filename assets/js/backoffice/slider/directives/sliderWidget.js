angular.module('momi-sliders')
  .directive('sliderWidget', function (widgetService,sliderService,$state){

    'use strict';
    var thisresize = function(item){


        	var classToSet= 'style1' ,classFont='mediumFont';
        	var x = item.sizeX, y = item.sizeY;

          if(y <= 2){
               classToSet = 'style0'; 
           }else
           if(x <= 2){
                classToSet= 'style0';
           }else
           if(y > 12){
                    classToSet= 'style0';
           }
           if(x > 16){
                
                    classToSet= 'style0';
           }
           
    
    $('.sliderWidget .RESIZEHEIGHT').height(item.getElementSizeY()-94)
    setTimeout(function(){
      
      $('.sliderWidget .RESIZEHEIGHT md-card-title-text').getNiceScroll().resize();
    },1)
    $('#noLastWidgetElment').css('height' , item.getElementSizeY()-94 +'px')
    $('.card-media ').height(item.getElementSizeY()-125)
    $('.card-media ').width(item.getElementSizeY()-125)
        	
        	item.$element.removeClass('style0 style1 style2 style3 style4 style5 style6 style7 style8 style9 style10 style11 style12 style13 style14 style15 smallFont extralargeFont mediumFont  largeFont')
        	.addClass(classToSet+ ' ' + classFont)
        	.addClass('sliderWidget')
    	
    }
    return {
      scope: {},
      replace: true,
      templateUrl: 'js/backoffice/slider/partials/sliderWidget.html',
      controller:function($scope,sliderService,$state){
            $scope.editArticleState=function(id){
                
                $state.go('dashboard/blog/edit',{id:id})
            }
             $scope.optionScroll = {
              cursorcolor:'#FFFFFF',
              cursoropacitymin: 0, // change opacity when cursor is inactive (scrollabar "hidden" state), range from 1 to 0
              cursoropacitymax: 0.3,
              cursorborder:'none',
              railoffset: {left:8}
            }
      },
      link:function(scope,element,attrs){


      		
      	thisresize(scope.$parent.gridsterItem)

        sliderService.fetchHome().then(function(data){

          scope.slideshow = data;

          console.log(scope.slideshow);
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

});