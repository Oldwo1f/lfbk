angular.module('momi-user')
  .directive('usersPage', function(){

    'use strict';

    return {
      	scope: {
      		usersList:'=',
      	},
		replace: true,
      	templateUrl: 'js/backoffice/user/partials/users.html',
      	controller:function($mdDialog,$scope,$rootScope,userService,tagService,imageService,documentService,$sailsSocket,$stateParams,$state,usSpinnerService){
			console.log($scope.usersList);

			$scope.returnParentState=function(){
				// console.log('returnParentState BLOG');
				$state.go('^')
			}
			$scope.returnDashboardState=function(){
				// console.log('returnDashboardState BLOG');
				$state.go('dashboard')
			}
			$scope.goCategoriesState=function(){
				// console.log('returnDashboardState BLOG');
				$state.go('categories')
			}
			
			$scope.returnPreviousState=function(){
				if($rootScope.previousState){
					$state.go($rootScope.previousState.name, $rootScope.previousStateParams)
				}else{
					$state.go('^')
				}
			}

			$scope.sort=$stateParams.sort ? $stateParams.sort : 'createdAt DESC' ;
			$scope.page=$stateParams.page ? $stateParams.page : 1 ;
			$scope.nbPerPage=$stateParams.nbPerPage ? $stateParams.nbPerPage : 10 ;
			$scope.fin = false;
			$scope.spinneropts = {
			  lines: 7 // The number of lines to draw
			, length: 0 // The length of each line
			, width: 20 // The line thickness
			, radius: 20 // The radius of the inner circle
			, scale: 0.5 // Scales overall size of the spinner
			, corners: 1 // Corner roundness (0..1)
			, color: '#1c7dfa' // #rgb or #rrggbb or array of colors
			, opacity: 0.02 // Opacity of the lines
			, rotate: 0 // The rotation offset
			, direction: 1 // 1: clockwise, -1: counterclockwise
			, speed: 0.9 // Rounds per second
			, trail: 59 // Afterglow percentage
			, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
			, zIndex: 2e9 // The z-index (defaults to 2000000000)
			, className: 'myUserSpinner' // The CSS class to assign to the spinner
			, top: 'auto' // Top position relative to parent
			, left: 'auto' // Left position relative to parent
			, shadow: false // Whether to render a shadow
			, hwaccel: false // Whether to use hardware acceleration
			, position: 'relative' // Element positioning
			};
			


			$scope.fetchUsers=function(){
				console.log('fetchUsersssssssssssssssss');
				userService.fetch($scope.sort,$scope.page,$scope.nbPerPage).then(function(data){
					$scope.usersList = data;
				})
			}
			$scope.pagin=1;
			$scope.myPagingFunction=function(){
				if(!$scope.searchSlug){
					$rootScope.startSpin();
					$scope.pagin++;
					console.log('myPagingFunction');
					userService.fetch($scope.sort,$scope.pagin,10).then(function(data){
						console.log(data);
						if(data.length==0)
						{
							$scope.fin = true
						}else{
							$scope.usersList = _.union($scope.usersList , data);
						}
						$rootScope.stopSpin()
					})
				}
			}
				$scope.blurSearch= 0;
			$scope.searchUser=function(){
				console.log('SEARCHARTICLE');
				if($scope.searchSlug){
					if($scope.blurSearch== 0){
						console.log('$scope.searchSlug');
						console.log($scope.searchSlug);
						userService.search($scope.searchSlug,$scope.sort).then(function(data){
							console.log(data);
							$scope.usersList = data;
						}).catch(function(e){
							console.log('err');
							console.log(e);
						})
					}else if($scope.blurSearch== 1){
						console.log('$scope.searchSlug');
						console.log($scope.searchSlug);
						userService.search($scope.searchSlug,$scope.sort).then(function(data){
							console.log(data);
							$scope.usersList = data;
							$scope.blurSearch = 2;
						}).catch(function(e){
							console.log('err');
							console.log(e);
						})
					}else if($scope.blurSearch== 2){
						console.log('$scope.searchSlug');
						$scope.blurSearch = 0;
					}
				}else{
					userService.fetch($scope.sort,0,10).then(function(data){
						console.log(data);
						if(data.length==0)
						{
							$scope.fin = true
						}else{
							$scope.usersList = data;
						}
						$scope.stopSpin()
					})
				}
			}

			$scope.blurOnEnter=function($event,$element) {
				if($event.keyCode == 13){
					// $event.currentTarget.blur()
					console.log('ON ENTER');
					$scope.blurSearch = 1;	
					$scope.searchUser();
				}else{
					$scope.blurSearch = 0;
				}
				
			}
			$scope.changeSort=function(type){
				switch(type)
				{
					case 'createdAt':
						if($scope.sort == 'createdAt DESC'){
							$scope.sort =	'createdAt ASC'
						}else{
						 	$scope.sort =	'createdAt DESC'
						}
					break;
					case 'role':
						if($scope.sort == 'role ASC'){
							$scope.sort =	'role DESC'
						}else{
						 	$scope.sort =	'role ASC'
						}
					break;
					case 'name':
						if($scope.sort == 'name ASC'){
							$scope.sort =	'name DESC'
						}else{
						 	$scope.sort =	'name ASC'
						}
					break;case 'email':
						if($scope.sort == 'email ASC'){
							$scope.sort =	'email DESC'
						}else{
						 	$scope.sort =	'email ASC'
						}
					break;
				}
				// $stateParams.sort = $scope.sort;
				console.log($scope.sort);
				$state.transitionTo('users', { sort: $scope.sort,page:$scope.page,nbPerPage:$scope.nbPerPage}, {location:true});
				console.log('fetchUsers');
				// $scope.fetchUsers()
				
			}	
			$scope.update=function(userid){
				console.log(userid);
				$rootScope.startSpin();
				var attrToUpdate = {};
				attrToUpdate[attribute] = value;
				userService.update(userid,attrToUpdate).then(function(data){
					console.log('----------------------------------------------------------');
					console.log(data);
					// console.log($scope.$parent);
					// $rootScope.$broadcast('userSelfChange',data);

        			$rootScope.stopSpin();
				},function(d){
					console.log('EROOR');
				})
			}	
			$rootScope.$on('userSelfcreate',function(e,data){
				console.log('userSelfcreate');
				console.log(data);
					$scope.usersList.unshift(data);
			})	
			$rootScope.$on('userSelfChange',function(e,data){
				console.log(data);
					var index = _.findIndex($scope.usersList, function(o) { return o.id == data.id; });
					if( index !== -1) {
						$scope.usersList[index] = data;
					}
			})		
			$rootScope.$on('userSelfRemove',function(e,data){
				console.log(data);
				console.log('userSelfRemove');
					var index = _.findIndex($scope.usersList, function(o) { return o.id == data.id; });
					if( index !== -1) {
						$scope.usersList.splice(index,1)
					}
			})	
			

			    $sailsSocket.subscribe('user',function(data){
			        console.log('ON user');
			        console.log(data);
			        if(data.verb =='created'){

			        	$scope.usersList.unshift(data.data)
			        	
			        }else
			        if(data.verb =='updated'){
			        	// _.find($scope.usersList,function(o) { return o.age < 40; });
			        	var index = _.findIndex($scope.usersList, function(o) { return o.id == data.id; });
						if( index !== -1) {
							
							console.log($scope.usersList[index]);
							_.merge($scope.usersList[index], data.data)
							console.log(data.id);
							// $scope.$broadcast('ellipsContent-'+data.id);
						}
			        }else
			        if(data.verb =='destroyed'){
			        	// _.find($scope.usersList,function(o) { return o.age < 40; });
			        	var index = _.findIndex($scope.usersList, function(o) { return o.id == data.id; });
						if( index !== -1) {
							
							console.log($scope.usersList[index]);
							$scope.usersList.splice(index,1)
							// console.log(data.id);
							// $scope.$broadcast('ellipsContent-'+data.id);
						}
			        }else
			        if(data.verb =='addedTo'){
							console.log('addedTO');
							var userTochange = _.find($scope.usersList, function(o){ return o.id == data.id})

							if(data.attribute == 'tags'){

								if(userTochange){

								tagService.fetchOne(data.addedId).then(function(tag){
									console.log(tag);
									userTochange.tags.push(tag)

								},function(d){
									console.log('EROOR');
								})
								}
							}else
							if(data.attribute == 'categories'){

								console.log('categories');
								console.log(data.addedId);

								categoryService.fetchOne(data.addedId).then(function(cat){
									console.log(cat);
									userTochange.categories.push(cat)

								},function(d){
									console.log('EROOR');
								})
							}
							if(data.attribute == 'images'){

								console.log('images');
								console.log(data.addedId);
								imageService.fetchOne(data.addedId).then(function(cat){
									console.log(cat);
									userTochange.images.push(cat)

								},function(d){
									console.log('EROOR');
								})
							}
							if(data.attribute == 'documents'){

								console.log('documents');
								console.log(data.addedId);
								documentService.fetchOne(data.addedId).then(function(cat){
									console.log(cat);
									userTochange.documents.push(cat)

								},function(d){
									console.log('EROOR');
								})
							}

						}else
						if(data.verb =='removedFrom'){
							console.log('removeFrom');
							var userTochange = _.find($scope.usersList, function(o){ return o.id == data.id})

							if(data.attribute == 'tags'){
								var index = _.findIndex(userTochange.tags, function(o) { return o.id == data.removedId; });
								if( index !== -1) {
									userTochange.tags.splice(index,1)
								}
							}
							if(data.attribute == 'categories'){
								var index = _.findIndex(userTochange.categories, function(o) { return o.id == data.removedId; });
								if( index !== -1) {
									userTochange.categories.splice(index,1)
								}
							}
							if(data.attribute == 'images'){
								var index = _.findIndex(userTochange.images, function(o) { return o.id == data.removedId; });
								if( index !== -1) {
									userTochange.images.splice(index,1)
								}
							}
							if(data.attribute == 'documents'){
								var index = _.findIndex(userTochange.documents, function(o) { return o.id == data.removedId; });
								if( index !== -1) {
									userTochange.documents.splice(index,1)
								}
							}

						}
			    })
				
			


			$scope.ModalAdd=function(Cat){
				
			    $mdDialog.show({
			      	controller: function($scope,$rootScope,userService, $timeout){
			      	
			      		$scope.formData = {};
			      		$scope.formData.role = 'admin';

			      		$scope.addUser = function(){
			      			console.log('ADD USER');
			      			$('.invalidInput').removeClass('invalidInput');
			      			if($scope.formData.email && $scope.formData.name && $scope.formData.firstname){
			      				
			      				userService.create($scope.formData).then(function(data){
			      					console.log('ok');
			      					console.log(data);
			      					$rootScope.$broadcast('userSelfcreate',data);
			      					$rootScope.stopSpin();
		                        	$mdDialog.hide()
			      					
			      				}).catch(function(err){

			      					console.log(err);
			      					if(err.status == 400)
			      					{
			      						console.log('invalid form req');
			      						_.map(err.invalidAttributes, function(val,key){

			      							console.log(key);
			      							$('input[name="'+key+'"]').addClass('invalidInput');
			      							console.log(val);	
			      						})

			      					}
			      					
			      				})
			      			}
			      			console.log($scope.formData);
			      			// if($scope.formData.email == null){}
			      		}

			      		$scope.verifyEmailExist=function(){
			      			

			      			
			      		}

			     	},
			      	templateUrl: 'js/backoffice/user/partials/add.html',
			      	parent: angular.element(document.body),
			      	// targetEvent: ev,
			      	clickOutsideToClose:true,
			    })
			    .then(function(answer) {
			      $scope.status = 'You said the information was "' + answer + '".';
			    }, function() {
			      $scope.status = 'You cancelled the dialog.';
			    });
			}
			$scope.ModalEdit=function(user){
				
			    $mdDialog.show({
			      	controller: function($scope,$rootScope,userService, $timeout){
			      	
			      		$scope.formData = user;
			      		// $scope.formData.role = 'admin';
			      		// deleteUser
			      		$scope.update=function(attribute){
							console.log(user.id);
							$rootScope.startSpin();
							// var attrToUpdate = {};
							// attrToUpdate[attribute] = value;
							userService.update(user.id,$scope.formData).then(function(data){
								console.log('----------------------------------------------------------');
								console.log(data);
								// console.log($scope.$parent);
								// $rootScope.$broadcast('userSelfChange',data);

			        			$rootScope.stopSpin();
							},function(d){
								console.log('EROOR');
							})
						}	
						$scope.deleteUser=function(){
							console.log(user.id);
							$rootScope.startSpin();
							// var attrToUpdate = {};
							// attrToUpdate[attribute] = value;
							userService.remove(user.id).then(function(data){
								console.log('---------REMOVED-------------------------------------------------');
								console.log(data);
								// console.log($scope.$parent);
								$rootScope.$broadcast('userSelfRemove',data);
								$mdDialog.hide()
			        			$rootScope.stopSpin();
							},function(d){
								console.log('EROOR');
							})
						}	
			      		$scope.addUser = function(){
			      			console.log('ADD USER');
			      			$('.invalidInput').removeClass('invalidInput');
			      			if($scope.formData.email && $scope.formData.name && $scope.formData.firstname){
			      				
			      				userService.create($scope.formData).then(function(data){
			      					console.log('ok');
			      					console.log(data);
			      					$rootScope.$broadcast('userSelfcreate',data);
			      					$rootScope.stopSpin();
		                        	$mdDialog.hide()
			      					
			      				}).catch(function(err){

			      					console.log(err);
			      					if(err.status == 400)
			      					{
			      						console.log('invalid form req');
			      						_.map(err.invalidAttributes, function(val,key){

			      							console.log(key);
			      							$('input[name="'+key+'"]').addClass('invalidInput');
			      							console.log(val);	
			      						})

			      					}
			      					
			      				})
			      			}
			      			console.log($scope.formData);
			      			// if($scope.formData.email == null){}
			      		}

			      		
						function tinymce_focus(){
							console.log('FOCUS');
					        $('.mce-edit-area').addClass('focused');
					    }

					    function tinymce_blur(){
					        $('.mce-edit-area').removeClass('focused');
					    	console.log('BLUR');
					    }

			      		$scope.tinymceOption ={
			      			// skin: 'myStyle',
			      			content_css : '/styles/tinymce.css' ,
			      			setup: function(editor) {

			  					var placeholder = $('#' + editor.id).attr('placeholder');
							    if (typeof placeholder !== 'undefined' && placeholder !== false) {
							      var is_default = false;
							      editor.on('init', function() {
							        // get the current content
							        var cont = editor.getContent();
							        $(editor.getDoc()).contents().find('body').focus(function(){tinymce_focus();});
			                    	$(editor.getDoc()).contents().find('body').blur(function(){tinymce_blur();});
							        // If its empty and we have a placeholder set the value
							        if (cont.length === 0) {
							          editor.setContent(placeholder);
							          // Get updated content
							          cont = placeholder;
							        }
							        // convert to plain text and compare strings
							        is_default = (cont == placeholder);

							        // nothing to do
							        if (!is_default) {
							          return;
							        }
							      })
							      .on('focus', function() {
							        // replace the default content on focus if the same as original placeholder
							        if (is_default) {
							          editor.setContent('');
							        }
							      })
						      	  .on("blur", function() {
								        console.log('ON bbbblur');
							         	if (editor.getContent().length === 0) {
									    	editor.setContent(placeholder);
								    	}
							      	});
					      		}

					      		editor.on("blur", function() {
							        
							        $scope.update('description');
						      	});
							},
			      			plugins: 'link image code',
			      			statusbar:false,
			      			toolbar: 'undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist indent outdent | link image '


						}

			     	},
			      	templateUrl: 'js/backoffice/user/partials/edit.html',
			      	parent: angular.element(document.body),
			      	// targetEvent: ev,
			      	clickOutsideToClose:true,
			    })
			    .then(function(answer) {
			      $scope.status = 'You said the information was "' + answer + '".';
			    }, function() {
			      $scope.status = 'You cancelled the dialog.';
			    });
			}


			if($stateParams.pseudostate == 'add')
			{
				console.log('NOW IT OK');
				$scope.ModalAdd()
			}
		},
		link:function(scope,element,attrs){
			
		}
    };

});