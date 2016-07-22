angular.module('momi-sliders')
.factory('sliderService', function ($http,$q,$sailsSocket,$state,$auth) {
    var service = {};
    // service.items=[];  
    // service.me={};  

    // service.filter={slug:'',page:1,order:'createdAt DESC',perPage:10};

    service.fetch= function(sort,page,nbPerPage) {
        var deferred = $q.defer();
        sort = sort? sort : 'date DESC'
        nbPerPage = nbPerPage ? nbPerPage : 100
        page = page ? page : 1
        console.log('sort', sort);
        console.log('nbPerPage', nbPerPage);
        console.log('page', page);
        // console.log(stateParams);
        // console.log(service.filter);
        $sailsSocket.get('/api/slideshow?sort='+sort+'&limit='+nbPerPage+'&skip='+nbPerPage*(page-1)).success(function (data,status) {
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
    service.fetchHome= function(sort,page,nbPerPage) {
        var deferred = $q.defer();
        
        $sailsSocket.get("/api/slideshow/home").success(function (data,status) {
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

    service.create=function(data){

        console.log('ADDNEW Service');
        // user = {date : new Date(),status:'draft'};
        var deferred = $q.defer();
        // user.password = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $sailsSocket.post('/api/slideshow',data).success(function (data,status) {
            console.log('SUCCESS');
            deferred.resolve(data);
        }).error(function (data,status) {
            
            deferred.reject(data);
        })
        return deferred.promise;      
    }
    service.createBlankSlide=function(slideshowID){

        console.log('ADDNEW Service');

        // var data = {date : new Date(),status:'draft'};
        var deferred = $q.defer();
        // user.password = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $sailsSocket.post('/api/slideshow/'+slideshowID+'/slides',{}).success(function (data,status) {
            console.log('SUCCESS');
            deferred.resolve(data);
        }).error(function (data,status) {
            
            deferred.reject(data);
        })
        return deferred.promise;      
    }
    service.saveSlide=function(slideID,formData){

        console.log('ADDNEW Service');

        // var data = {date : new Date(),status:'draft'};
        var deferred = $q.defer();
        // user.password = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $sailsSocket.put('/api/slide/'+slideID,formData).success(function (data,status) {
            console.log('SUCCESS');
            deferred.resolve(data);
        }).error(function (data,status) {
            
            deferred.reject(data);
        })
        return deferred.promise;      
    }
    service.deleteSlide=function(slideID,slideshowID){

        console.log('DELETE Service');
        console.log(slideID,slideshowID);

        // var data = {date : new Date(),status:'draft'};
        var deferred = $q.defer();
        // user.password = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $sailsSocket.delete('/api/slideshow/'+slideshowID+'/slides/'+slideID).success(function (data,status) {
        // $sailsSocket.delete('/api/slide/'+slideID).success(function (data,status) {
            console.log('SUCCESS');
            deferred.resolve(data);
        }).error(function (data,status) {
            
            deferred.reject(data);
        })
        return deferred.promise;      
    }
    service.deleteSlideshow=function(slideshowID){

        console.log('DELETE Service');
        console.log(slideshowID);

        // var data = {date : new Date(),status:'draft'};
        var deferred = $q.defer();
        // user.password = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $sailsSocket.delete('/api/slideshow/'+slideshowID).success(function (data,status) {
        // $sailsSocket.delete('/api/slide/'+slideID).success(function (data,status) {
            console.log('SUCCESS');
            deferred.resolve(data);
        }).error(function (data,status) {
            
            deferred.reject(data);
        })
        return deferred.promise;      
    }

    service.fetchSlide= function(id) {
        var deferred = $q.defer();

        $sailsSocket.get('/api/slide/'+id).success(function (data,status) {
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
            $sailsSocket.delete('/api/slide/'+id+'/images/'+imgID).success(function (data,status) {
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
  
    service.fetchOneSlide=function(id){

        console.log('fetchOneSlide');
        console.log(id);
        // user = {date : new Date(),status:'draft'};
        var deferred = $q.defer();
        $sailsSocket.get('/api/slide/'+id).success(function (data,status) {
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

    service.removeDocument=function(id,docId){

        console.log('remove Service');
        // console.log(id);
        // console.log(values);
        var deferred = $q.defer();
        $sailsSocket.delete('/api/slide/'+id+'/documents/'+docId).success(function (data,status) {
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

    

    return service;
});