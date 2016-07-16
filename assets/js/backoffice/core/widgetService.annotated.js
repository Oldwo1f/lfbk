angular.module('core').factory('widgetService',["$compile", "$http", "userService", "$auth", "$rootScope", function ($compile,$http,userService,$auth,$rootScope) {
	
	var service = {};
	service.list = {};

	service.defaultList = {
		"titleDashWidget":{"publicName":"Titre dashboard","enabled":true,"required":false,"widgetName":"titleDashWidget","html":"<title-dash-widget></title-dash-widget>","sizeX":4,"sizeY":2,"minSizeY":1,"maxSizeY":24,"minSizeX":1,"maxSizeX":24,"col":0,"row":0,"noresize":false,"transparent":false},
		"menuWidget":{"publicName":"Menu","enabled":true,"required":false,"widgetName":"menuWidget","html":"<menu-widget></menu-widget>","sizeX":4,"sizeY":6,"minSizeY":1,"maxSizeY":12,"minSizeX":1,"maxSizeX":24,"col":0,"row":2,"noresize":false,"transparent":false},
		"dashboardconfigWidget":{"publicName":"Config","enabled":true,"required":true,"widgetName":"dashboardconfigWidget","html":"<dashboardconfig-widget></dashboardconfig-widget>","sizeX":8,"sizeY":1,"minSizeY":1,"maxSizeY":12,"minSizeX":1,"maxSizeX":24,"col":11,"row":5,"noresize":false,"transparent":false},
		"lastarticleWidget":{"publicName":"Dernier article","enabled":true,"required":false,"widgetName":"lastarticleWidget","html":"<lastarticle-widget></lastarticle-widget>","sizeX":7,"sizeY":5,"minSizeY":1,"maxSizeY":12,"minSizeX":1,"maxSizeX":24,"col":12,"row":0,"noresize":false,"transparent":false},
		"lastprojectWidget":{"publicName":"Dernier projet","enabled":true,"required":false,"widgetName":"lastprojectWidget","html":"<lastproject-widget></lastproject-widget>","sizeX":7,"sizeY":5,"minSizeY":1,"maxSizeY":12,"minSizeX":1,"maxSizeX":24,"col":12,"row":0,"noresize":false,"transparent":false},
		"categorycloudWidget":{"publicName":"Categories cloud","enabled":true,"required":false,"widgetName":"categorycloudWidget","html":"<categorycloud-widget></categorycloud-widget>","sizeX":8,"sizeY":2,"minSizeY":1,"maxSizeY":12,"minSizeX":1,"maxSizeX":24,"col":4,"row":2,"noresize":false,"transparent":false},
		"tagcloudWidget":{"publicName":"Tags cloud","enabled":true,"required":false,"widgetName":"tagcloudWidget","html":"<tagcloud-widget></tagcloud-widget>","sizeX":8,"sizeY":2,"minSizeY":1,"maxSizeY":12,"minSizeX":1,"maxSizeX":24,"col":4,"row":0,"noresize":false,"transparent":false},
		"profileWidget":{"publicName":"Profile","enabled":true,"required":true,"widgetName":"profileWidget","html":"<profile-widget></profile-widget>","sizeX":5,"sizeY":5,"minSizeY":1,"maxSizeY":12,"minSizeX":1,"maxSizeX":24,"col":19,"row":0,"noresize":false,"transparent":false},
		"notificationWidget":{"publicName":"Notification","enabled":true,"required":false,"widgetName":"notificationWidget","html":"<notification-widget></notification-widget>","sizeX":5,"sizeY":5,"minSizeY":1,"maxSizeY":12,"minSizeX":1,"maxSizeX":24,"col":19,"row":0,"noresize":false,"transparent":false},
		"analyticsWidget":{"publicName":"Analytics","enabled":true,"required":false,"widgetName":"analyticsWidget","html":"<analytics-widget></analytics-widget>","sizeX":12,"sizeY":7,"minSizeY":7,"maxSizeY":7,"minSizeX":12,"maxSizeX":12,"col":12,"row":10,"noresize":true,"transparent":false},
	};
	service.defaultListmd= {
		"titleDashWidget": {"publicName": "Titre dashboard","enabled": true,"required": false,"widgetName": "titleDashWidget","html": "<title-dash-widget></title-dash-widget>","sizeX": 4,"sizeY": 2,"minSizeY": 1,"maxSizeY": 24,"minSizeX": 1,"maxSizeX": 24,"col": 0,"row": 0,"noresize": false,"transparent": false},
		"menuWidget": {"publicName": "Menu","enabled": true,"required": false,"widgetName": "menuWidget","html": "<menu-widget></menu-widget>","sizeX": 8,"sizeY": 2,"minSizeY": 1,"maxSizeY": 12,"minSizeX": 1,"maxSizeX": 24,"col": 0,"row": 2,"noresize": false,"transparent": false     },
		"dashboardconfigWidget": {"publicName": "Config","enabled": true,"required": true,"widgetName": "dashboardconfigWidget","html": "<dashboardconfig-widget></dashboardconfig-widget>","sizeX": 12,"sizeY": 1,"minSizeY": 1,"maxSizeY": 12,"minSizeX": 1,"maxSizeX": 24,"col": 0,"row": 13,"noresize": false,"transparent": false     },
		"lastarticleWidget": {"publicName": "Dernier article","enabled": true,"required": false,"widgetName": "lastarticleWidget","html": "<lastarticle-widget></lastarticle-widget>","sizeX": 8,"sizeY": 5,"minSizeY": 1,"maxSizeY": 12,"minSizeX": 1,"maxSizeX": 24,"col": 0,"row": 8,"noresize": false,"transparent": false},
		"lastprojectWidget": {"publicName": "Dernier projet","enabled": true,"required": false,"widgetName": "lastprojectWidget","html": "<lastproject-widget></lastproject-widget>","sizeX": 8,"sizeY": 4,"minSizeY": 1,"maxSizeY": 12,"minSizeX": 1,"maxSizeX": 24,"col": 0,"row": 4,"noresize": false,"transparent": false},
		"categorycloudWidget": {"publicName": "Categories cloud","enabled": true,"required": false,"widgetName": "categorycloudWidget","html": "<categorycloud-widget></categorycloud-widget>","sizeX": 4,"sizeY": 2,"minSizeY": 1,"maxSizeY": 12,"minSizeX": 1,"maxSizeX": 24,"col": 4,"row": 0,"noresize": false,"transparent": false},
		"tagcloudWidget": {"publicName": "Tags cloud","enabled": true,"required": false,"widgetName": "tagcloudWidget","html": "<tagcloud-widget></tagcloud-widget>","sizeX": 4,"sizeY": 3,"minSizeY": 1,"maxSizeY": 12,"minSizeX": 1,"maxSizeX": 24,"col": 8,"row": 5,"noresize": false,"transparent": false},
		"profileWidget": {"publicName": "Profile","enabled": true,"required": true,"widgetName": "profileWidget","html": "<profile-widget></profile-widget>","sizeX": 4,"sizeY": 5,"minSizeY": 1,"maxSizeY": 12,"minSizeX": 1,"maxSizeX": 24,"col": 8,"row": 0,"noresize": false,"transparent": false},
		"notificationWidget": {"publicName": "Notification","enabled": true,"required": false,"widgetName": "notificationWidget","html": "<notification-widget></notification-widget>","sizeX": 4,"sizeY": 5,"minSizeY": 1,"maxSizeY": 12,"minSizeX": 1,"maxSizeX": 24,"col": 8,"row": 8,"noresize": false,"transparent": false},
		"analyticsWidget":{"publicName":"Analytics","enabled":true,"required":false,"widgetName":"analyticsWidget","html":"<analytics-widget></analytics-widget>","sizeX":12,"sizeY":7,"minSizeY":7,"maxSizeY":7,"minSizeX":12,"maxSizeX":12,"col":0,"row":13,"noresize":true,"transparent":false},
	};
   	service.defaultListsm=  {
	   	"titleDashWidget": {"publicName": "Titre dashboard","enabled": true,"required": false,"widgetName": "titleDashWidget","html": "<title-dash-widget></title-dash-widget>","sizeX": 3,"sizeY": 3,"minSizeY": 1,"maxSizeY": 24,"minSizeX": 1,"maxSizeX": 24,"col": 0,"row": 0,"noresize": false,"transparent": false},
	   	"menuWidget": {"publicName": "Menu","enabled": true,"required": false,"widgetName": "menuWidget","html": "<menu-widget></menu-widget>","sizeX": 4,"sizeY": 3,"minSizeY": 1,"maxSizeY": 12,"minSizeX": 1,"maxSizeX": 24,"col": 3,"row": 0,"noresize": false,"transparent": false},
	   	"dashboardconfigWidget": {"publicName": "Config","enabled": true,"required": true,"widgetName": "dashboardconfigWidget","html": "<dashboardconfig-widget></dashboardconfig-widget>","sizeX": 12,"sizeY": 1,"minSizeY": 1,"maxSizeY": 12,"minSizeX": 1,"maxSizeX": 24,"col": 0,"row": 14,"noresize": false,"transparent": false},
	   	"lastarticleWidget": {"publicName": "Dernier article","enabled": true,"required": false,"widgetName": "lastarticleWidget","html": "<lastarticle-widget></lastarticle-widget>","sizeX": 8,"sizeY": 5,"minSizeY": 1,"maxSizeY": 12,"minSizeX": 1,"maxSizeX": 24,"col": 0,"row": 9,"noresize": false,"transparent": false},
	   	"lastprojectWidget": {"publicName": "Dernier projet","enabled": true,"required": false,"widgetName": "lastprojectWidget","html": "<lastproject-widget></lastproject-widget>","sizeX": 8,"sizeY": 4,"minSizeY": 1,"maxSizeY": 12,"minSizeX": 1,"maxSizeX": 24,"col": 0,"row": 5,"noresize": false,"transparent": false},
	   	"categorycloudWidget": {"publicName": "Categories cloud","enabled": true,"required": false,"widgetName": "categorycloudWidget","html": "<categorycloud-widget></categorycloud-widget>","sizeX": 7,"sizeY": 2,"minSizeY": 1,"maxSizeY": 12,"minSizeX": 1,"maxSizeX": 24,"col": 0,"row": 3,"noresize": false,"transparent": false},
	   	"tagcloudWidget": {"publicName": "Tags cloud","enabled": true,"required": false,"widgetName": "tagcloudWidget","html": "<tagcloud-widget></tagcloud-widget>","sizeX": 4,"sizeY": 3,"minSizeY": 1,"maxSizeY": 12,"minSizeX": 1,"maxSizeX": 24,"col": 8,"row": 5,"noresize": false,"transparent": false},
	   	"profileWidget": {"publicName": "Profile","enabled": true,"required": true,"widgetName": "profileWidget","html": "<profile-widget></profile-widget>","sizeX": 5,"sizeY": 5,"minSizeY": 1,"maxSizeY": 12,"minSizeX": 1,"maxSizeX": 24,"col": 7,"row": 0,"noresize": false,"transparent": false},
	   	"notificationWidget": {"publicName": "Notification","enabled": true,"required": false,"widgetName": "notificationWidget","html": "<notification-widget></notification-widget>","sizeX": 4,"sizeY": 6,"minSizeY": 1,"maxSizeY": 12,"minSizeX": 1,"maxSizeX": 24,"col": 8,"row": 8,"noresize": false,"transparent": false},
    	"analyticsWidget":{"publicName":"Analytics","enabled":true,"required":false,"widgetName":"analyticsWidget","html":"<analytics-widget></analytics-widget>","sizeX":12,"sizeY":9,"minSizeY":1,"maxSizeY":12,"minSizeX":1,"maxSizeX":24,"col":0,"row":18,"noresize":true,"transparent":false},
    };

	service.changeDash=function(theme){
		 $rootScope.startSpin()
		console.log('changeDash');
		console.log($auth.getPayload().sub);
		console.log(theme);
		console.log(winwidth);
		console.log(service.list);
		if(winwidth <= 800){
			userService.saveDash($auth.getPayload().sub,{dashboardsm:service.list,theme:theme}).then(function(data){
			console.log('saved sm!!!!'); $rootScope.stopSpin()
			}).catch(function(errr){
				console.log(errr); $rootScope.stopSpin()
			})
		}else if(winwidth<= 1024){
			userService.saveDash($auth.getPayload().sub,{dashboardmd:service.list,theme:theme}).then(function(data){
				console.log('saved md!!!!'); $rootScope.stopSpin()
			}).catch(function(errr){
				console.log(errr); $rootScope.stopSpin()
			})
		}else{
			userService.saveDash($auth.getPayload().sub,{dashboard:service.list,theme:theme}).then(function(data){
			console.log('saved!!!!'); $rootScope.stopSpin()
			}).catch(function(errr){
				console.log(errr); $rootScope.stopSpin()
			})
		}
		
		
	}
	service.restoreDash=function(){
		console.log('restoreDASH');
		console.log('restoreDASH');
		console.log('restoreDASH');
		console.log('restoreDASH');
		console.log('restoreDASH');
		
        
		
		return userService.selfProfile().then(function(data){
			console.log(data);
			if(winwidth >1024)
			{
				console.log('LG DASH');
				if(data.dashboard){
					console.log('here');	
					service.list = data.dashboard;
				}
				else
					service.list = service.defaultList;
			}
			else if(winwidth <=1024 && winwidth > 800){
				console.log('MD DASH');
				if(data.dashboardmd)
					service.list = data.dashboardmd;
				else
					service.list = service.defaultListmd;
				
			}
			else if(winwidth <=800 ){
				console.log('SM DASH');
				if(data.dashboardsm)
					service.list = data.dashboardsm;
				else
					service.list = service.defaultListsm;
				
			}
			
			// deferred.resolve()
			return service.list;


		}).catch(function(err){

			console.log(err);
			// deferred.reject()
		})
		// return deferred.promise;
		
	}



	// service.restoreDash();






	return service;
}])