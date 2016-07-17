angular.module('core')
  .directive('analyticsWidget', ["widgetService", "dashboardService", "$state", function (widgetService,dashboardService,$state){

    'use strict';
    var thisresize = function(item){


        	var classToSet= 'style1' ,classFont='mediumFont';
        	var x = item.sizeX, y = item.sizeY;

            if(y < 3){
               classToSet = 'style0'; 
           }else
           if(x < 3 || x > 24){
              classToSet = 'style0'; 
           }
           // if(y == 2){
           //      classToSet= 'style0';
           // }else
           // if(y == 3){
           //      classToSet= 'style2';
           //      if(x <=4){
           //          classToSet= 'style0';

           //      }
           // }else
           // if(y >= 4){
           //      classToSet= 'style1';
           //      if(x <=4){
           //          classToSet= 'style0';
           //      }
           // }
           // if(y >= 7){
               
           //          classToSet= 'style0';
           // }
           // if(x == 5){
           //      if(y >= 5){
           //          classToSet= 'style0';
           //      }
           // }
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
    setTimeout(function(){
      $('.analyticsWidget .RESIZEHEIGHT').height(item.getElementSizeY()-84)
      $('#noDataElment').height(item.getElementSizeY()-84)
      // $('#anatitycs').height(400)
      $('.chart-container').height(item.getElementSizeY()-250)
      $('.analyticsWidget .RESIZEHEIGHT').getNiceScroll().resize();
    },1)
        	
        	item.$element.removeClass('style0 style1 style2 style3 style4 style5 style6 style7 style8 style9 style10 style11 style12 style13 style14 style15 smallFont extralargeFont mediumFont  largeFont')
        	.addClass(classToSet+ ' ' + classFont)
    	
    }
    return {
		scope: {},
		replace: true,
		templateUrl: 'js/backoffice/params/partials/analyticsWidget.html',
		controller:["$scope", "dashboardService", "$state", "$sailsSocket", "$rootScope", function($scope,dashboardService,$state,$sailsSocket,$rootScope){
            $scope.count={};
            $scope.metric='ga:sessions';
            $scope.period='lastweek';
            $scope.previousperiod='';
            $scope.count.avgSessionDuration=0
            $scope.loadingGraph=true;
            $scope.analytics=true;
            $scope.loadingLabels=true;

            $scope.choosePeriod=function () {
                console.log('CHOOSEPERIOD');
                // $scope.period = period;
                console.log('period',$scope.period); 
                $scope.loadGraph()

            }

    $scope.changeColors=function (color,serie, metrics) {

        console.log('CHANGECOLORS');
        $scope.metric = metrics;
        $scope.myoptions.tooltipTemplate= '<%= value %>';
        if(serie=='Taux rebond' || serie=='% nouvelles sessions')
            $scope.myoptions.tooltipTemplate= '<%= value %> %';
        if(serie=='Durée moyenne d\'une session' ){
            // var dura = moment.duration()   
            $scope.myoptions.tooltipTemplate= '<% if(moment.duration(value*1000).hours()>0){ %><%= moment.duration(value*1000).hours() %>h <%} %><% if(moment.duration(value*1000).minutes()>0){ %><%= moment.duration(value*1000).minutes() %>m <%} %><%= moment.duration(value*1000).seconds() %>s ';
        }
        $scope.colors=[]
        $scope.colors.push(color)
        console.log(color);
        $scope.series = [];
        $scope.series.push(serie)
        $scope.loadGraph();
    }
    $scope.loadGraph=function () {
        console.log('LOAD GRAPH');
        $scope.analytics=true;
        $scope.loadingGraph=true;
        if($scope.previousperiod!=$scope.period)
            $scope.loadingLabels=true;
        $scope.previousperiod=$scope.period
        $scope.data=[];
        $scope.data[0]=[];
        $scope.labels=[];

        console.log('Period and mertics',$scope.period,$scope.metric);
        dashboardService.Analitycs($scope.period,$scope.metric).then(function (data) {
            console.log('data=',data);

            for(var key in data.count)
            {
                $scope.count[key.substring(3,key.length)]=data.count[key]
            }
            for(var i in data.graph)
            {
                // for(var key in data.graph[i])
                // {
                    $scope.labels.push(data.graph[i][0])
                // }
                // for(var key in data.graph[i][1])
                // {
                    $scope.data[0].push(Math.round(data.graph[i][1]*100)/100)
                // }    
            }
                console.log($scope.data);

            console.log('$scope.labels',$scope.labels);
            var tmpdate;
            for(var j in $scope.labels){
                if($scope.period=='year')
                {
                    tmpdate = moment($scope.labels[j],"MM")
                    $scope.labels[j] = tmpdate.format('MMMM')
                }else{
                    tmpdate = moment($scope.labels[j],"YYYYMMDD")
                    $scope.labels[j] = tmpdate.format('Do MMM')
                }
            }
            $scope.loadingGraph=false;
            $scope.loadingLabels=false;
            // console.log($('.chart-container + .chart-container'));
            // $('.chart-container + .chart-container').remove()
        },function (err) {
            $scope.analytics=false;
        })
    }
    $scope.loadGraph();

    
    $scope.colors = ['#568203'];
    $scope.series = ['Sessions'];
    $scope.myoptions = { scaleBeginAtZero : true,responsive:true,maintainAspectRatio: false,scaleShowGridLines : false,tooltipTemplate: '<%= value %>'}

            // $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
  // $scope.data = [300, 500, 100];

            // $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
            // $scope.series = ['Series A', 'Series B'];
            // $scope.data = [
            //   [65, 59, 10, 11, 56, 55, 40],
            //   [28, 48, 40, 19, 16, 27, 10]
            // ];
            // $scope.onClick = function (points, evt) {
            //   console.log(points, evt);
            // };
            // $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
            // $scope.options = {
            //   scales: {
            //     yAxes: [
            //       {
            //         id: 'y-axis-1',
            //         type: 'linear',
            //         display: true,
            //         position: 'left'
            //       },
            //       {
            //         id: 'y-axis-2',
            //         type: 'linear',
            //         display: true,
            //         position: 'right'
            //       }
            //     ]
            //   }
            // };
		    
		}],
		link:function(scope,element,attrs){




				
			thisresize(scope.$parent.gridsterItem)




			scope.$parent.$on('gridster-item-resized', function(e,item) {
				thisresize(item)
		    })

		}
    };

}]);