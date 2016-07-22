angular.module('momi-sliders')
  .directive('sliders', function (articleService,paramsService){

    'use strict';

    return {
      
      	scope: {
      		slideshowList:'=',
      		// dbstats:'=',
      		// stockage:'=',
      	},
		replace: true,
		templateUrl: 'js/backoffice/slider/partials/sliders.html',
		controller:function($timeout,$scope,$mdDialog,$rootScope,userService,$filter,sliderService,imageService,documentService,$sailsSocket,$stateParams,$state,usSpinnerService,Upload){
				
				console.log('_________________________________________________');
				console.log('_________________________________________________');
				console.log('_________________________________________________');
				// console.log($scope.slideshowList);
				// $scope.slideshowList[0].slides = _.sortBy($scope.slideshowList[0].slides, 'rank')
				// console.log($scope.slideshowList);
				for(var i in $scope.slideshowList){

					$scope.slideshowList[i].slides = _.sortBy($scope.slideshowList[i].slides, 'rank')

				}


			$scope.returnParentState=function(){
				$state.go('^')
			}
			$scope.returnPreviousState=function(){
				if($rootScope.previousState){
					$state.go($rootScope.previousState.name, $rootScope.previousStateParams)
				}else{
					$state.go('^')
				}
			}
			$scope.returnDashboardState=function(){
				$state.go('dashboard')
			}
			$scope.sortOption={
				'ui-floating':false,
				stop: function(e, ui) {
					console.log('UPDATE');
					console.log(e);
					console.log(ui);
					console.log(ui.item);
					console.log($(ui.item).attr('rel'));
					var slideshowID = $(ui.item).attr('rel')
					// console.log($scope.formData.images);
					var index = _.findIndex($scope.slideshowList, function(o) { return o.id == slideshowID; });
					if( index !== -1) {
						// $scope.slideshowList[index].slides.push(data.child);
						var allSlides = $scope.slideshowList[index].slides;

						console.log(allSlides);
						for(var i=0; i< allSlides.length; i++)
						{
							console.log(i);
							console.log(allSlides[i].title);
							$rootScope.startSpin();
							sliderService.saveSlide(allSlides[i].id,{rank:i}).then(function(d){
								$rootScope.stopSpin();
								console.log('cool');
								
							})
						}
					}
					

					
				
				},

				start:function(e,ui) {
					console.log('START');
					// console.log($scope.formData.images);
				}
			};
			$scope.addSlide=function(slideshowID){
				console.log('slideshowID');
				console.log(slideshowID);
				$rootScope.startSpin();
				sliderService.createBlankSlide(slideshowID).then(function(data){
					console.log('----------------------------------------------------------');
					console.log(data);
					$scope.slideshowList
					var index = _.findIndex($scope.slideshowList, function(o) { return o.id == slideshowID; });
					if( index !== -1) {
						$scope.slideshowList[index].slides.push(data.child);
					}
        			$rootScope.stopSpin();
				},function(d){
					console.log('EROOR');
				})

			}
			$scope.deleteSlideshow=function(slideshowID){
				console.log('slideshowID');
				console.log(slideshowID);
				$rootScope.startSpin();
				sliderService.deleteSlideshow(slideshowID).then(function(data){
					console.log('----------------------------------------------------------');
					console.log(data);
					// $scope.slideshowList
					var index = _.findIndex($scope.slideshowList, function(o) { return o.id == slideshowID; });
					if( index !== -1) {
						$scope.slideshowList.splice(index,1);
					}
        			$rootScope.stopSpin();
				},function(d){
					console.log('EROOR');
				})

			}

			$rootScope.$on('slideshowADD',function(e,data){
				console.log('slideshowADD');
				console.log(data);
					// var index = _.findIndex($scope.slideshowList, function(o) { return o.id == data.slideshowID; });
					// if( index !== -1) {

					// 	var index2 = _.findIndex($scope.slideshowList[index].slides, function(o) { return o.id == data.data.id; });
					// 	if( index2 !== -1) {
						data.data.slides = [];
							$scope.slideshowList.push(data.data);
						// }
					// }
			})	
			$rootScope.$on('slideSelfChange',function(e,data){
				console.log('slideSelfChangeslideSelfChangeslideSelfChangeslideSelfChangeslideSelfChange');
				console.log(data);
					var index = _.findIndex($scope.slideshowList, function(o) { return o.id == data.slideshowID; });
					if( index !== -1) {

						var index2 = _.findIndex($scope.slideshowList[index].slides, function(o) { return o.id == data.data.id; });
						if( index2 !== -1) {
							$scope.slideshowList[index].slides[index2] = data.data;
						}
					}
			})	
			$rootScope.$on('slideSelfRemove',function(e,data){
				console.log('slideSelfRemove');
				console.log(data);
					var index = _.findIndex($scope.slideshowList, function(o) { return o.id == data.slideshowID; });
					if( index !== -1) {
						console.log('hehe');
						$scope.slideshowList.splice(index,1,data.data)
						// var index2 = _.findIndex($scope.slideshowList[index].slides, function(o) { return o.id == data.data.id; });
						// if( index2 !== -1) {
						// 	console.log('hehe2');

						// 	$scope.slideshowList[index].slides.splice(index2,1,data.data)
						// 	console.log(tt);
						// }
					}
			})		
			$rootScope.$on('slideSelfChangeImg',function(e,data){
				console.log('slideSelfChangeImg');
				console.log(data);
					var index = _.findIndex($scope.slideshowList, function(o) { return o.id == data.slideshowID; });
					if( index !== -1) {
						console.log('hehe');
						
						var index2 = _.findIndex($scope.slideshowList[index].slides, function(o) { return o.id == data.item.id; });
						if( index2 !== -1) {
							console.log('hehe2');

							$scope.slideshowList[index].slides.splice(index2,1,data.item)
						}
					}
			})			
			$rootScope.$on('slideSelfChangeDocument',function(e,data){
				console.log('slideSelfChangeDocument');
				console.log(data);
					var index = _.findIndex($scope.slideshowList, function(o) { return o.id == data.slideshowID; });
					if( index !== -1) {
						console.log('hehe');
						
						var index2 = _.findIndex($scope.slideshowList[index].slides, function(o) { return o.id == data.item.id; });
						if( index2 !== -1) {
							console.log('hehe2');

							$scope.slideshowList[index].slides[index2].documents = data.item.documents
						}
					}
			})	
			$sailsSocket.subscribe('slideshow',function(data){
			        console.log('ON slideshow');
			        console.log(data);
			        
			        	if(data.verb =='created'){
			        	
							console.log('created');
							$scope.slideshowList.push(data.data)
							

						}else
						if(data.verb =='updated'){
			        	// _.find($scope.articlesList,function(o) { return o.age < 40; });
			        	// var index = _.findIndex($scope.articlesList, function(o) { return o.id == data.id; });
						// if( index !== -1) {
							console.log('MERGE');
							// console.log($scope.articlesList[index]);
							_.merge($scope.formData, data.data)

						}else
						if(data.verb =='destroyed'){
			        		var index = _.findIndex($scope.slideshowList, function(o) { return o.id == data.id; });
							if( index !== -1) {
								$scope.slideshowList.splice(index,1)
							}
						}else
						if(data.verb =='addedTo'){
							console.log('addedTO');
							if(data.attribute == 'slides'){

								console.log('slides');
								console.log(data.addedId);
								sliderService.fetchOneSlide(data.addedId).then(function(slide){
									console.log(slide);
									var index = _.findIndex($scope.slideshowList, function(o) { return o.id == data.id; });
									if( index !== -1) {
										$scope.slideshowList[index].slides.push(slide)
									}

								},function(d){
									console.log('EROOR');
								})
							}

						}else
						if(data.verb =='removedFrom'){
							console.log('removeFrom');
							if(data.attribute == 'slides'){
								var index = _.findIndex($scope.slideshowList, function(o) { return o.id == data.id; });
								if( index !== -1) {
									var index2 = _.findIndex($scope.slideshowList[index].slides, function(o) { return o.id == data.removedId; });
									if( index2 !== -1) {
										$scope.slideshowList[index].slides.splice(index2,1)
									}
								}
							}
							

						}
			    })
			$sailsSocket.subscribe('slide',function(data){
			        console.log('ON category');
			        console.log(data);
			        
			        if(data.verb =='updated'){

			        	console.log('updated');
			        	console.log(data.id);
			        	// console.log($scope.articlesList);

			        	
	     //    			var index = _.findIndex($scope.formData.categories, function(o) { return o.id == data.id; });
						// if( index !== -1) {
						// 	console.log(data.data);
						// 	// $scope.articlesList[i].categories.splice(index,1,data.data)
						// 	_.merge($scope.formData.categories[index], data.data)
						// }
			        	
			        	// _.find($scope.articlesList,function(o) { return o.age < 40; });
			   //      	var index = _.findIndex($scope.articlesList, function(o) { return o.id == data.id; });
						// if( index !== -1) {
							
						// 	console.log($scope.articlesList[index]);
						// 	_.merge($scope.articlesList[index], data.data)
						// 	console.log(data.id);
						// 	// $scope.$broadcast('ellipsContent-'+data.id);
						// }
			        }
			       
			})
			// $scope.optionScroll = {
              // cursorcolor:'#FFFFFF',
              // cursoropacitymin: 0, // change opacity when cursor is inactive (scrollabar "hidden" state), range from 1 to 0
              // cursoropacitymax: 0.3,
              // cursorborder:'none',
              // railoffset: {left:8}
            // }
            $scope.parentCB =function(data){
            	console.log('parentCBparentCBparentCBparentCBparentCB');
            }
			
			$scope.displayAddPopUp=function(){
				// $scope.showAdvanced = function(ev) {
				// console.log('showadvan');
			    // var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
			    $mdDialog.show({
			      	controller: function($scope,$rootScope,sliderService){
			      	
			      		$scope.formData = {};
			      		$scope.formData.width = 800;
			      		$scope.formData.height = 600;



			      		$scope.CreateSlideshow=function(){
			      			
			      			if($scope.formData.title)
			      			{

								$rootScope.startSpin();
								sliderService.create($scope.formData).then(function(data){
									console.log('----------------------------------------------------------');
									console.log(data);
									// $scope.$parent.parentCB(data);
									$rootScope.$broadcast('slideshowADD',{data:data});
									$mdDialog.hide()
				        			$rootScope.stopSpin();
								},function(d){
									console.log('EROOR');
								})
			      			}
			      		}


			     	},
			      	templateUrl: 'js/backoffice/slider/partials/addSlideShowModal.html',
			      	parent: angular.element(document.body),
			      // targetEvent: ev,
			      	clickOutsideToClose:true,
			    })
			    .then(function(answer) {
			      $scope.status = 'You said the information was "' + answer + '".';
			    }, function() {
			      $scope.status = 'You cancelled the dialog.';
			    });
			    
			// };



			}
			$scope.editSlidePopUp=function(slideshow,slideID,slide){

				var slideshowID = slideshow.id
				var slideshowWidth = slideshow.width
				var slideshowHeight = slideshow.height
				console.log(slideshowWidth);
				var aspectRatioSlideshow = slideshowWidth+'/'+slideshowHeight;
				// var aspectRatioSlideshow = '4/3';
				console.log(aspectRatioSlideshow);
				// $scope.showAdvanced = function(ev) {
				// console.log('showadvan');
			    // var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
			    $mdDialog.show({
			    	// resolve:{
			     //  		slide:function(sliderService){
			     //  			console.log('RESOLVE66666666666666666666666666666666666666666666666666666666666666666666666666666666');
			     //  			return sliderService.fetchSlide(slideID)
			     //  		}
			     //  	},
			      	controller: function($scope,$rootScope,sliderService){


			      		console.log(slide);
			      		$scope.formData = {};
			      		$scope.formData.id = slide.id;
			      		$scope.formData.title = slide.title;
			      		$scope.formData.link1 = slide.link1;
			      		$scope.formData.link2 = slide.link2;
			      		$scope.formData.content = slide.content;
			      		$scope.formData.images = slide.images || [];
			      		$scope.formData.documents = slide.documents || [];
			      		$scope.formData.btn= slide.btn;

			      		$scope.indexDocument=0;
			        	$scope.uploadsDocument=[];

			        	$scope.uploadDocument = function (files) {
					        if (files && files.length) {
					            for (var i = 0; i < files.length; i++) {
					                var file = files[i];
					                $scope.uploadsDocument[$scope.indexDocument]={};
					                $scope.uploadsDocument[$scope.indexDocument].file=file;
					                $scope.uploadsDocument[$scope.indexDocument].status='start';
					                $scope.uploadsDocument[$scope.indexDocument].text='0%';
					                $scope.indexDocument++;
					            }
					            for (var i = 0; i < $scope.uploadsDocument.length; i++) {
					                if( $scope.uploadsDocument[i].status=='start'){
					                	
					                    $scope.uploadsDocument[i].status='progress';
					                    (function(i){
						                    Upload.upload({
						                        url: '/api/slide/'+$scope.formData.id+'/documents',
						                        data: {files : $scope.uploadsDocument[i].file,filename:'tt',name:'t'}
						                    }).then(function (data) {
						                        console.log(data);
						                        $rootScope.$broadcast('slideSelfChangeDocument',{item : data.data.parent,slideshowID:slideshowID});
						                        $scope.formData.documents=data.data.parent.documents
						                        $scope.uploadsDocument[i].text='Envoi terminé';
												$scope.touched = true;

						                        (function(i){

				                                    $timeout(function () {
				                                        $scope.uploadsDocument[i].status = 'success';
				                                    },3000)
				                                })(i)
						                    },function (evt) {
						                        //HANDLE ERROR
						                    },function (evt) {
				                                $scope.uploadsDocument[i].progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
				                                $scope.uploadsDocument[i].text = $scope.uploadsDocument[i].progressPercentage+'%'
						                    });
					                    })(i)
					                }
					            };
					        }
					    };

						$scope.removeDocument=function(doc){
							$rootScope.startSpin();
							sliderService.removeDocument($scope.formData.id,doc).then(function(data){
								var index = _.findIndex($scope.formData.documents, function(o) { return o.id == doc; });
								if( index !== -1) {
									$scope.formData.documents.splice(index, 1);
								}
								// $rootScope.$broadcast('articleSelfChangeDoc',data);
								//  else {
								// 	$scope.formData.tags.push(tag_with_id);
								// }
								$rootScope.stopSpin();
							},function(d){
								console.log('EROOR');
							})
						}
			     //  		$scope.formData.width = 800;
			     //  		$scope.formData.height = 600;
			     		$scope.removeImg=function(img){
							$rootScope.startSpin();
							sliderService.removeImage($scope.formData.id,img).then(function(data){
								console.log(data);
								var index = _.findIndex($scope.formData.images, function(o) { return o.id == img; });
								if( index !== -1) {
									$scope.formData.images.splice(index, 1);
			                    		$rootScope.$broadcast('slideSelfChangeImg',{item : data,slideshowID:slideshowID});

								}
								//  else {
								// 	$scope.formData.tags.push(tag_with_id);
								// }
								// $rootScope.$broadcast('articleSelfChangeImg',data);
								$rootScope.stopSpin();
							},function(d){
								console.log('EROOR');
							})
						}

			        	$scope.indexImage=0;
			        	$scope.uploadingImages=[];

			        	$scope.resizeOnly=function(imgID){
			        		$rootScope.startSpin();
							$scope.dataToSend = {};
					        $scope.dataToSend.displayHeight = $scope.imgcrop.displayHeight;
					        $scope.dataToSend.displayWidth = $scope.imgcrop.displayWidth;
					        $scope.dataToSend.scaledWidth = $scope.imgcrop.scaledWidth;
					        $scope.dataToSend.scaledHeight = $scope.imgcrop.scaledHeight;
					        $scope.dataToSend.scaledTop = $scope.imgcrop.scaledTop;
					        $scope.dataToSend.scaledLeft = $scope.imgcrop.scaledLeft;
					        $scope.dataToSend.aspectRatio = $scope.imgcrop.aspectRatio;
					        $scope.dataToSend.landscape = $scope.imgcrop.landscape;
					        $scope.dataToSend.containerWidth = $scope.imgcrop.containerWidth;
					        $scope.dataToSend.containerHeight = $scope.imgcrop.containerHeight;
					        $scope.dataToSend.filename= $scope.imgcrop.filename;
					        $scope.dataToSend.imgid= $scope.imgEditId;
					        $scope.dataToSend.normalWidth= slideshowWidth;
			            	$scope.dataToSend.normalHeight= slideshowHeight;
			            	if(!$scope.imgcrop.landscape){
			            		$scope.dataToSend.normalWidth= slideshowWidth;
			            		$scope.dataToSend.normalHeight= slideshowHeight;
			            	}
			                    	
							$('#imageCropSource').hide();

					        $scope.imgcrop.imgEditId = 0;
			            	$scope.imgcrop.displayHeight = 0;
							$scope.imgcrop.displayWidth = 0;
							$scope.imgcrop.scaledWidth = 0;
							$scope.imgcrop.scaledHeight = 0;
							$scope.imgcrop.scaledTop = 0;
							$scope.imgcrop.scaledLeft = 0;
							$scope.imgcrop.containerWidth = 0;
							$scope.imgcrop.containerHeight = 0;
							$scope.imgcrop.aspectRatio = aspectRatioSlideshow;
							$scope.imgcrop.imgSrc = "";

					        $sailsSocket.post('/api/image/resize/',$scope.dataToSend).success(function (data,status) {
					            console.log('SUCCESS RESIZE'); 
					            console.log($scope.dataToSend);
					            
					            var index = _.findIndex($scope.formData.images, function(o) { return o.id == $scope.dataToSend.imgid; });
								if( index !== -1) {
									console.log('IN INDEX');
									var savedfilename = $scope.formData.images[index].filename+'?rdm='+Math.round(Math.random() * 999999);
									// $scope.formData.images[index].filename = '';
									$scope.formData.images[index].filename= savedfilename
			                    		// $rootScope.$broadcast('slideSelfChangeImg',{item : data,slideshowID:slideshowID});

								}
					            // var imgsrc = $('.imageList img').attr('src')
					            // console.log(imgsrc);
					            // console.log(data);

					            $rootScope.stopSpin();
					            
					        }).error(function (data,status) {
					            console.log(data);
					            console.log('errOR');
					        })
				        }

			        	$scope.uploadImage = function () {

			        		console.log($scope.imgcrop);
			        		console.log('UPLOAD IMAGE');
					        $scope.dataToSend = {};
					        $scope.fileToSend = $scope.imgcrop.file; 
					        $scope.dataToSend.file = $scope.imgcrop.file; 
					        $scope.dataToSend.displayHeight = $scope.imgcrop.displayHeight;
					        $scope.dataToSend.displayWidth = $scope.imgcrop.displayWidth;
					        $scope.dataToSend.scaledWidth = $scope.imgcrop.scaledWidth;
					        $scope.dataToSend.scaledHeight = $scope.imgcrop.scaledHeight;
					        $scope.dataToSend.scaledTop = $scope.imgcrop.scaledTop;
					        $scope.dataToSend.scaledLeft = $scope.imgcrop.scaledLeft;
					        $scope.dataToSend.aspectRatio = $scope.imgcrop.aspectRatio;
					        $scope.dataToSend.landscape = $scope.imgcrop.landscape;
					        $scope.dataToSend.containerWidth = $scope.imgcrop.containerWidth;
					        $scope.dataToSend.containerHeight = $scope.imgcrop.containerHeight;
					        $scope.uploadingImages[$scope.indexImage] = {};
					        $scope.uploadingImages[$scope.indexImage].status = 'start';
					        $scope.uploadingImages[$scope.indexImage].text='0%';
					        $scope.uploadingImages[$scope.indexImage].file=$scope.imgcrop.file;

			                $scope.uploadingImages[$scope.indexImage].status='progress';
			                (function(indexImage){
			                	$scope.imgcrop.imgEditId = 0;
			                	$scope.imgcrop.displayHeight = 0;
								$scope.imgcrop.displayWidth = 0;
								$scope.imgcrop.scaledWidth = 0;
								$scope.imgcrop.scaledHeight = 0;
								$scope.imgcrop.scaledTop = 0;
								$scope.imgcrop.scaledLeft = 0;
								$scope.imgcrop.containerWidth = 0;
								$scope.imgcrop.containerHeight = 0;
								$scope.imgcrop.aspectRatio = aspectRatioSlideshow;
								$scope.imgcrop.imgSrc = "";
								$('#imageCropSource').hide();

			                    Upload.upload({
			                        url: '/api/slide/'+slideID+'/images',
			                        data: {file :$scope.fileToSend}
			                        	// 'displayWidth':$scope.dataToSend.displayWidth,
			                        	// 'scaledWidth':$scope.dataToSend.scaledWidth,
			                        	// 'scaledHeight':$scope.dataToSend.scaledHeight,
			                        	// 'scaledTop':$scope.dataToSend.scaledTop,
			                        	// 'scaledLeft':$scope.dataToSend.scaledLeft,
			                        	// 'aspectRatio':$scope.dataToSend.aspectRatio,
			                        	// 'landscape':$scope.dataToSend.landscape,
			                        
			                    }).then(function (data) {
			                    	console.log(data);
			                    	console.log(data.data.child);
			                    	var dataTOCALLBACK = data.data.parent;
			                    	var dataChild = data.data.child;
			                    	$scope.dataToSend.imgid= data.data.child.id;
			                    	$scope.dataToSend.normalWidth= slideshowWidth;
			                    	$scope.dataToSend.normalHeight= slideshowHeight;
			                    	if(!$scope.imgcrop.landscape){
			                    		$scope.dataToSend.normalWidth= slideshowWidth;
			                    		$scope.dataToSend.normalHeight= slideshowHeight;
			                    	}
			                    	$scope.dataToSend.filename= data.data.child.filename;
			                    	$rootScope.startSpin();
			      					$sailsSocket.post('/api/image/resize/',$scope.dataToSend).success(function (data,status) {
							            console.log('SUCCESS RESIZE');
							            $scope.formData.images.push(dataChild)
			                    		$rootScope.$broadcast('slideSelfChangeImg',{item : dataTOCALLBACK,slideshowID:slideshowID});

							            $rootScope.stopSpin();
							          
							        }).error(function (data,status) {
							            console.log(data);
							            console.log('errOR');
							        })


			                        $scope.uploadingImages[indexImage].text='Envoi terminé';
									$scope.touched = true;

			                        (function(indexImage){

			                            $timeout(function () {
			                                $scope.uploadingImages[indexImage].status = 'success';
			                            },3000)
			                        })(indexImage)
			                    },function (evt) {
			                        //HANDLE ERROR
			                    },function (evt) {
			                        $scope.uploadingImages[indexImage].progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
			                        $scope.uploadingImages[indexImage].text = $scope.uploadingImages[indexImage].progressPercentage+'%'
			                    });
			                })($scope.indexImage)
					        $scope.indexImage++;
					    };
					    // $scope.changeOrientation=function(){
					    // 	if($scope.imgcrop.landscape)
					    // 	{
					    // 		$scope.imgcrop.landscape = false;
					    // 		$scope.imgcrop.aspectRatio = $scope.imgcrop.aspectRatioPortrait
					    // 	}else{
					    // 		$scope.imgcrop.landscape = true;
					    // 		$scope.imgcrop.aspectRatio = $scope.imgcrop.aspectRatioPaysage
					    // 	}
					    // }
					    $scope.resizeagain=function(img){
					    	console.log(img);

					    	$scope.imgcrop.imgSrc = 'image/originalSize/'+img.filename;
					    	$scope.imgcrop.imgEditId = img.id;
					    	$scope.imgEditId = img.id;
					    	$scope.imgcrop.filename = img.filename;
							
					    }
					    $scope.imgcrop = {};
					    $scope.imgcrop.imgEditId = 0;
						$scope.imgcrop.displayHeight = 0;
						$scope.imgcrop.displayWidth = 0;
						$scope.imgcrop.scaledWidth = 0;
						$scope.imgcrop.scaledHeight = 0;
						$scope.imgcrop.scaledTop = 0;
						$scope.imgcrop.scaledLeft = 0;
						$scope.imgcrop.containerWidth = 0;
						$scope.imgcrop.containerHeight = 0;
						$scope.imgcrop.aspectRatio = aspectRatioSlideshow;
						$scope.imgcrop.imgSrc = "";
						// $scope.imgcrop.aspectRatioPaysage = '16/9';
						// $scope.imgcrop.aspectRatioPortrait = '3/4';

						
						$scope.addImgCrop=function($files){
							console.log('uploadFiles');
							console.log($files);
							// $scope.imgcrop = {};
							$scope.imgcrop.imgEditId = 0;
							$scope.imgcrop.displayHeight = 0;
							$scope.imgcrop.displayWidth = 0;
							$scope.imgcrop.scaledWidth = 0;
							$scope.imgcrop.scaledHeight = 0;
							$scope.imgcrop.scaledTop = 0;
							$scope.imgcrop.containerWidth = 0;
							$scope.imgcrop.containerHeight = 0;
							$scope.imgcrop.scaledLeft = 0;
							$scope.imgcrop.imgSrc = '';
							$('#imageCropSelector').css({'display':'none'})
								
							// $files[0].$ngfBlobUrl;

							if(typeof($files[0])== 'object'){
								$scope.imgcrop.imgSrc = $files[0].$ngfBlobUrl;
								$('#imageCropSource').show();

								$scope.imgcrop.file = $files[0];
								$scope.$applyAsync();
								$scope.imgcrop.aspectRatio = aspectRatioSlideshow
							    // if($files[0].$ngfWidth < $files[0].$ngfHeight)
				       //      	{
				       //      		$scope.imgcrop.aspectRatio = $scope.imgcrop.aspectRatioPortrait;
				       //      		$scope.imgcrop.landscape = false;
				       //      	}else{
				       //      		$scope.imgcrop.aspectRatio = $scope.imgcrop.aspectRatioPaysage;
				       //      		$scope.imgcrop.landscape = true;
				       //      	}
							}

						};
						// $scope.uploadDocument=function($files){
						// 	console.log('fileDrop');
						// 	console.log($files);



						// };
						$scope.removeImgCrop = function(){
							console.log('CANCEL IMAGE');
							setTimeout(function(){
								// $('#imageCropSource').attr('src','');
								$('#imageCropSource').hide();
								$scope.imgcrop.imgSrc = '';
								$scope.$applyAsync();
								
							},1)
							// $scope.$applyAsync();
						}


			      		$scope.saveSlide=function(attribute){
			      			
			     //  			if($scope.formData.title)
			     //  			{

								$rootScope.startSpin();
								var attrToUpdate = {};
								attrToUpdate[attribute] = $scope.formData[attribute];
								sliderService.saveSlide(slideID,$scope.formData).then(function(data){
									console.log('----------------------------------------------------------');
									console.log(data);
									$rootScope.$broadcast('slideSelfChange',{data:data,slideshowID :slideshowID});
									// $mdDialog.hide()
				        			$rootScope.stopSpin();
								},function(d){
									console.log('EROOR');
								})
			     //  			}
			      		};
			      		$scope.deleteSlide=function(attribute){
			      			
			     //  			if($scope.formData.title)
			     //  			{

								$rootScope.startSpin();
								var attrToUpdate = {};
								attrToUpdate[attribute] = $scope.formData[attribute];
								sliderService.deleteSlide(slideID,slideshowID).then(function(data){
									console.log('----------------------------------------------------------');
									console.log(data);
									$rootScope.$broadcast('slideSelfRemove',{data:data,slideshowID :slideshowID});
									$mdDialog.hide()
				        			$rootScope.stopSpin();
								},function(d){
									console.log('EROOR');
								})
			     //  			}
			      		}


			     	},
			      	templateUrl: 'js/backoffice/slider/partials/editSlideShowModal.html',
			      	parent: angular.element(document.body),
			      	
			      // targetEvent: ev,
			      	clickOutsideToClose:true,
			    })
			    .then(function(answer) {
			      $scope.status = 'You said the information was "' + answer + '".';
			    }, function() {
			      $scope.status = 'You cancelled the dialog.';
			    });
			    
			// };



			}

		},
		link:function(scope,element,attrs){
			
		}
    };

});