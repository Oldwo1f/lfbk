	  

(function(orig) {
  angular.modules = [];
  angular.module = function() {
    if (arguments.length > 1) {
      angular.modules.push(arguments[0]);
    }
    return orig.apply(null, arguments);
  }
})(angular.module);


var listWidgetDirectivesApp = function listWidgetDirectivesApp() {
  var listDirectives = function listDirectives(name) {
    return angular.module(name)._invokeQueue.filter(function (item) {
      return 'directive' === item[1] && item[2][0].match('Widget$');
    }).map(function (item) {
      return item[2][0];
    });
  };
  return angular.modules.map(listDirectives).reduce(function (acc, l) {
    return acc.concat(l);
  }, []);
};











 






angular.module('core', ['angular-notification-icons','ngLetterAvatar','sails.io','color.picker','satellizer','infinite-scroll','ui.sortable','ngTagsInput','ngFileUpload','ngMaterial','ui.router','gridster','ngSanitize','ngAnimate','ui.tinymce','angularMoment','ui.bootstrap.datetimepicker','jkuri.slimscroll','angularSpinner','momi-social','momi-user','momi-blog','momi-categories','momi-login'])
.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider){

    $stateProvider
      .state('dashboard', {
        url : '/dashboard',
        requiredLogin: true,

        views:{
            'dashboard':{
                template:'<dashboard></dashboard>',
                resolve:{
                    widgetlist:  ["widgetService", function(widgetService){
                        var t = widgetService.restoreDash();
                          return t
                    }],
                },

            }
        }
      
       })

      $urlRouterProvider.otherwise('/dashboard');

}]).run(['$state', function ($state) {}])

.run(["amMoment", function(amMoment) {
    amMoment.changeLocale('fr');
}])
.config(["$sailsSocketProvider", function($sailsSocketProvider) {

    $sailsSocketProvider.interceptors.push(function($q,$state,$rootScope) { return { 
          'responseError': function(rejection) {
            // do something on error
            console.log('ERRRRRRRRRRRRRRRRRRRERRRRRRRRRRRRRRRRRRRRRRREEEEEEEEEEEERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR');
            
            console.log(rejection);
            if(rejection.status == '401'){

                $('.pageDash').addClass('pageVisible').removeClass('pageAfter pageBefore');
                $('.page1').addClass('pageAfter').removeClass('pageVisible pageBefore');
                $('.page2').addClass('pageAfter').removeClass('pageVisible pageBefore');
                $rootScope.stopSpin()
                $state.go('logout')
            }
            // if (canRecover(rejection)) {
            //   return responseOrNewPromise
            // }
            return $q.reject(rejection);
          }
    };
    });


  



}]);
angular.module('core').controller('appController',["$rootScope", "$auth", "$state", "$sailsSocket", "userService", function($rootScope,$auth,$state, $sailsSocket, userService){


  if($auth.getToken()){
    $sailsSocket.defaults.headers.common.Authorization = 'Bearer '+ $auth.getToken();
    userService.selfProfile($auth.getPayload().sub).then(function(){
      console.log('cool');
    })
  }

   $rootScope.$on('$stateChangeStart',function (e,toState,toParams,fromState,fromParams){

            // if (toState.name == 'login' && $auth.isAuthenticated()){
            //     // requiredLogin = false;
            //     e.preventDefault();
            //     $state.go('/')
            // }

            if ($auth.isAuthenticated() && toState.name == 'logout') {
                
            }
            else
            if (!$auth.isAuthenticated() && toState.name != 'login') {
                e.preventDefault();
                $state.go('login');
            }

   });
   
}])


$(window).resize(function() {
  height = $(window).height()
  $('.containerLogin').css({'height':height+'px'});
}).resize()

$(window).load(function(){
	$('#loading').fadeOut(1000);
  
  
})

angular.module('core').config(['tagsInputConfigProvider', function(tagsInputConfigProvider) {
  tagsInputConfigProvider
    .setDefaults('tagsInput', {
      placeholder: 'Ajouter un tag',
      minLength: 2,
      addOnEnter: false,
      replaceSpacesWithDashes:false
    })
    .setDefaults('autoComplete', {
      debounceDelay: 200,
      loadOnDownArrow: true,
      loadOnEmpty: true,
      minLength:1
    })
}])
.config(['usSpinnerConfigProvider', function(usSpinnerConfigProvider) {
  var opts = {
  lines: 7 // The number of lines to draw
, length: 0 // The length of each line
, width: 20 // The line thickness
, radius: 20 // The radius of the inner circle
, scale: 0.5 // Scales overall size of the spinner
, corners: 1 // Corner roundness (0..1)
, color: '#52d669' // #rgb or #rrggbb or array of colors
, opacity: 0.02 // Opacity of the lines
, rotate: 0 // The rotation offset
, direction: 1 // 1: clockwise, -1: counterclockwise
, speed: 0.9 // Rounds per second
, trail: 59 // Afterglow percentage
, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
, zIndex: 2e9 // The z-index (defaults to 2000000000)
, className: 'myMainSpinner' // The CSS class to assign to the spinner
, top: '53px' // Top position relative to parent
, left: 'auto' // Left position relative to parent
, shadow: false // Whether to render a shadow
, hwaccel: false // Whether to use hardware acceleration
, position: 'fixed' // Element positioning
};
usSpinnerConfigProvider.setDefaults(opts);

}]);