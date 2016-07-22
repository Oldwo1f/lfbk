angular.module('core')
.factory('userService', function ($http,$q,$sailsSocket,$state,$auth) {
    var service = {};
    service.items=[];  
    service.me={};  

    service.filter={slug:'',page:1,order:'createdAt DESC',perPage:10};

    service.fetch= function(sort,page,nbPerPage) {
        var deferred = $q.defer();
        sort = sort? sort : 'date DESC'
        nbPerPage = nbPerPage ? nbPerPage : 10
        page = page ? page : 1
        console.log('sort', sort);
        console.log('nbPerPage', nbPerPage);
        console.log('page', page);
        // console.log(stateParams);
        // console.log(service.filter);
        $sailsSocket.get('/api/user?sort='+sort+'&limit='+nbPerPage+'&skip='+nbPerPage*(page-1)).success(function (data,status) {
            console.log(data);
            service.items =data;
            deferred.resolve(data);
        }).error(function (data,status) {
            // if(status == '401')
            //     $state.go('login')

            deferred.reject(status);
            // console.log(data);
            // console.log(status);
        })

        return deferred.promise;
    };
    service.searchUsers=function(searchText){
        var deferred = $q.defer();
        $sailsSocket.get('/api/user/searchAutocomplete/'+searchText).success(function (data,status) {
            var resultArray =[];
            if(data.hits.total > 0){
                for(var i in data.hits.hits){
                    resultArray.push(data.hits.hits[i]._source);
                }
            }
            deferred.resolve(resultArray);
        }).error(function (data,status) {
            
            console.log(data);
            deferred.reject(data);
        })
        return deferred.promise;      
    }
    service.create=function(user){

        console.log('ADDNEW Service');
        // user = {date : new Date(),status:'draft'};
        var deferred = $q.defer();
        user.password = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $sailsSocket.post('/api/user',user).success(function (data,status) {
            console.log('SUCCESS');
            deferred.resolve(data);
        }).error(function (data,status) {
            
            deferred.reject(data);
        })
        return deferred.promise;      
    }

    service.fetchLast= function() {
        var deferred = $q.defer();

        $sailsSocket.get('/api/user?sort=date DESC&limit=1&where={"status":"actif"}').success(function (data,status) {
            console.log(data);
            deferred.resolve(data[0]);
        }).error(function (data,status) {
            // if(status == '401')
            //     $state.go('login')
            deferred.reject(status);
            // console.log(data);
            // console.log(status);
        })

        return deferred.promise;
    };
    service.search= function(slug,sort) {
        var deferred = $q.defer();
        sort = sort? sort : 'date DESC'
       
        // console.log(stateParams);
        // console.log(service.filter);
        $sailsSocket.get('/api/user/search/'+sort+'/'+slug).success(function (data,status) {
            console.log(data);
            service.items =data;
            deferred.resolve(data);
        }).error(function (data,status) {
            // if(status == '401')
            //     $state.go('login')
            deferred.reject(status);
            // console.log(data);
            // console.log(status);
        })

        return deferred.promise;
    };
    service.removeImage=function(id,imgID){

        console.log('REMOVE Image Service');
        var deferred = $q.defer();
        console.log(id);
        console.log(imgID);
        if(imgID){
            $sailsSocket.delete('/api/user/'+id+'/images/'+imgID).success(function (data,status) {
                console.log('SUCCESS');
                console.log(data);
                deferred.resolve(data);
            }).error(function (data,status) {
                if(status == '401')
                    $state.go('login')
                console.log(data);
                deferred.reject(data);
            })
        }
        
        return deferred.promise;      
    }

    service.selfProfile=function(){

        if($auth.isAuthenticated()){
        console.log('isAuthenticated');

            id = $auth.getPayload().sub;
            // user = {date : new Date(),status:'draft'};
            var deferred = $q.defer();
            $sailsSocket.get('/api/user/'+id).success(function (data,status) {
                // console.log('SUCCESS');
                console.log(data);
                // setTimeout(function(){
                    
                service.me = data;
                // },2000)
                // console.log(data);
                deferred.resolve(data);
            }).error(function (data,status) {
                // if(status == '401')
                // console.log('ERROR');
                // console.log(data);
                deferred.reject(data);
            })
            return deferred.promise;      
        }else{
                    $state.go('login')
            
        }
    }   
    service.fetchOne=function(id){

        console.log('fetchOne User');
        console.log(id);
        // user = {date : new Date(),status:'draft'};
        var deferred = $q.defer();
        $sailsSocket.get('/api/user/'+id).success(function (data,status) {
            // console.log('SUCCESS');
            // console.log(data);
            deferred.resolve(data);
        }).error(function (data,status) {
            if(status == '401')
                $state.go('login')
            // console.log('ERROR');
            // console.log(data);
            deferred.reject(data);
        })
        return deferred.promise;      
    }
    service.update=function(id, values){

        console.log('updateValue Service');
        // console.log(id);
        // console.log(values);
        var deferred = $q.defer();
        $sailsSocket.put('/api/user/'+id,values).success(function (data,status) {
            console.log('SUCCESS');
            // console.log(data);
            deferred.resolve(data);
        }).error(function (data,status) {
            // if(status == '401')
            //     $state.go('login')
            console.log('serviceErr');
            console.log(data);
            deferred.reject(data);
        })
        return deferred.promise;      
    }
    service.saveDash=function(id, values){

        console.log('updateValue Service');
        // console.log(id);
        // console.log(values);
        var deferred = $q.defer();
        $sailsSocket.post('/api/user/'+id+'/saveDash',values).success(function (data,status) {
            console.log('SUCCESS');
            // console.log(data);
            deferred.resolve(data);
        }).error(function (data,status) {
            // if(status == '401')
            //     $state.go('login')
            console.log('serviceErr');
            console.log(data);
            deferred.reject(data);
        })
        return deferred.promise;      
    }
    service.remove=function(id){

        console.log('remove Service');
        // console.log(id);
        // console.log(values);
        var deferred = $q.defer();
        $sailsSocket.delete('/api/user/'+id).success(function (data,status) {
            // console.log('SUCCESS');
            // console.log(data);
            deferred.resolve(data);
        }).error(function (data,status) {
            if(status == '401')
                $state.go('login')
            console.log('serviceErr');
            console.log(data);
            deferred.reject(data);
        })
        return deferred.promise;      
    }
    service.firstConnexion=function(idfirst,password){

        console.log('firstConnexion');
        // console.log(id);
        // console.log(values);
        var deferred = $q.defer();
        $sailsSocket.post('/api/user/firstConnexion',{idfirst:idfirst,password:password}).success(function (data,status) {
            console.log('SUCCESS');
            console.log(data);
            deferred.resolve(data);
        }).error(function (data,status) {
            if(status == '401')
                $state.go('login')
            console.log('serviceErr');
            console.log(data);
            deferred.reject(data);
        })
        return deferred.promise;      
    }

    

    service.selfProfile();
    return service;
});