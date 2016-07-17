angular.module('momi-params').factory('paramsService', ['$http', '$q', function ($http,$q) {
    var service = {};
    
    service.frontConfig={};
    console.log('configService');
    service.h1 = '';
    service.url = '';
   

    service.sizequota=3200000000;
    service.defaultLanguage=[];
    service.languages=[];

    service.getLangs = function () {
        var deferred = $q.defer();
        $http.get('/getLangs').success(function (data,status) {
            service.defaultLanguage.push(data.defaults)
            service.languages=data.locales;
            deferred.resolve(data);
        }).error(function (data,status) {
            // messageCenterService.add('danger', 'Erreur de récupération du profile', { status: messageCenterService.status.unseen, timeout: 4000 });

            deferred.reject('error perso');
        })
        return deferred.promise;
    };
    service.getLangs()
    service.getConfig = function () {
        var deferred = $q.defer();
        console.log('GET COnfig');
        $http.get('/getConfig').success(function (data,status) {
           console.log(data);
           service.url= data.url
           service.h1=data.name;
           deferred.resolve(data);
        }).error(function (data,status) {
           // messageCenterService.add('danger', 'Erreur de récupération du profile', { status: messageCenterService.status.unseen, timeout: 4000 });           deferred.reject('error perso');       })       return deferred.promise;
        });

        return deferred.promise;
   };


    service.restartSite= function(lang) {
        var deferred = $q.defer();
        // console.log(stateParams);
        // console.log(service.filter);
        $http({method:'get',url:'/restartSite'}).success(function (data,status) {
            console.log(data);
            deferred.resolve(data);
        }).error(function (data,status) {
            deferred.reject('error perso');
        })

        return deferred.promise;
    }; 
    service.getVersion= function(lang) {
        var deferred = $q.defer();
        // console.log(stateParams);
        // console.log(service.filter);
        $http({method:'get',url:'/getVersion'}).success(function (data,status) {
            console.log(data);
            deferred.resolve(data);
        }).error(function (data,status) {
            deferred.reject('error perso');
        })

        return deferred.promise;
    }; 
    service.getDbStats= function(lang) {
        var deferred = $q.defer();
        // console.log(stateParams);
        // console.log(service.filter);
        $http({method:'get',url:'/getDbStats'}).success(function (data,status) {
            console.log(data);
            deferred.resolve(data);
        }).error(function (data,status) {
            deferred.reject('error perso');
        })

        return deferred.promise;
    }; 
    service.getUploadsSize= function(lang) {
        var deferred = $q.defer();
        // console.log(stateParams);
        // console.log(service.filter);
        $http({method:'get',url:'/getUploadsSize'}).success(function (data,status) {
            console.log(data);
            deferred.resolve(data);
        }).error(function (data,status) {
            deferred.reject('error perso');
        })

        return deferred.promise;
    }; 
    service.getTraductions= function(lang) {
        var deferred = $q.defer();
        // console.log(stateParams);
        // console.log(service.filter);
        $http({method:'get',url:'/getTraductions/'+lang}).success(function (data,status) {
            console.log(data);
            deferred.resolve(data);
        }).error(function (data,status) {
            deferred.reject('error perso');
        })

        return deferred.promise;
    };

    service.saveTraduction=function(lang,obj){

        console.log('EDIT Service');
        var deferred = $q.defer();
        // user.role = 'user'
        $http.put('/saveTraduction/'+lang,obj).success(function (data2,status2) {
            console.log('SUCCESS');
            console.log(data2);
            deferred.resolve(data2);
            

        }).error(function (data,status) {

            // console.log('ERROR');
            // console.log(data);
            deferred.reject(data);
        })
        
        return deferred.promise;      
    }
    return service;
}]);