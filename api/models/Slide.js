/**
 * Slide.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var Promise = require('bluebird');
var fs = require('fs'), Writable = require('stream').Writable;

module.exports = {
// schema: true,
  	attributes: {
  		title : {type:'string',defaultsTo:null},
    	link1 : {type:'string',defaultsTo:null}, 
    	link2 : {type:'string',defaultsTo:null},
    	content : {type:'text',defaultsTo:null},
    	btn : {type:'string',defaultsTo:null},
    	rank:{type:'int'},
    	images:{collection:'image',defaultsTo:[]},
    	documents:{collection:'document',defaultsTo:[]},
    	// image:{model:'image'},
    	slideshow : {
          model: 'slideshow',
        },
        selfUpdate:function(options,cb){
        	console.log(this.id);
	       var slideID =this.id 
	       console.log('SELF UPDATE');
	        console.log(options);
	        if(options.parentType == 'slideshow')
	        {
		        Slideshow.findOne(options.parentId).populate('slides').then(function(slideshow){
	        		console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
	        		console.log(slideshow);
	        		if(options.verb == 'add'){

	        			console.log('ADDDDD');

		               Slide.findOne(options.childId).then(function(data){
		               		console.log(data);
		                    
		                    return Slide.update(data.id ,
		                    {
		                        // nbArticles : data.nbArticles,
		                        rank : slideshow.slides.length
		                    }).then(function(result){
		                        // console.log(result[0]);
		                        cb(null,data);
		                        
		                    })
		                   
		                }).catch(function (err) {
		                    cb(err,null);
		                });
		            }
		  
		            if(options.verb == 'remove'){
		            	console.log('SLIDE REMOVEéééééééééé');

		            	return Promise.bind({})
		            	.then(function(){
		            		return Slide.findOne(slideID)
		            	})
		            	.then(function(data){
		            		this.slideToremove = data

		            		console.log('this.slideToremove');
		            		console.log(this.slideToremove);
		                    return Promise.map(slideshow.slides,function(slid){
		                    	console.log('slid1');
		                    	if(slid.rank > data.rank)
		                    	{
		                    		console.log('IFFFFFF');
		                    		Slide.findOne(slid.id).then(function(data1){
					                    return Slide.update(data1.id ,
					                    {
					                        rank : data1.rank-1
					                    }).then(function(result){
					                        // cb(null,data);
					                        return
					                    })
					                   
					                })

		                    	}
		                    	else{
		                    		return;
		                    	} 
		                    		
		                    })
		                   
		                }).then(function(){
		                	// console.log('imgToREmove');
		                	
		                	// if()
		                	return Slide.destroy(this.slideToremove.id).then(function(data){
	                            cb(null,data);
			                })


		                	// return data.images.map
		                }).catch(function (err) {
		                    cb(err,null);
		                });

		            }	

	        	}).catch(function(err){
	        		console.log(err);
	        	})
	        }

	   
	        //     if(options.verb == 'remove'){

	        //       User.findOne(this.id).then(function(data){
	        //             data.nbArticles= Number(data.nbArticles) -1;
	        //             data.total= Number(data.total) -1;
	                    
	        //                 return User.update(data.id ,
	        //                 {
	        //                     nbArticles : data.nbArticles,
	        //                     total : data.total
	        //                 }).then(function(result){
	        //                     User.publishUpdate( data.id , {
	        //                         nbArticles : data.nbArticles,
	        //                         total : data.total
	        //                     } )
	        //                     cb(null,result[0]);
	        //                 })

	                   
	        //         }).catch(function (err) {
	        //             cb(err,null);
	        //         });
	        //     }
	        // }
	        // if(options.parentType == 'project')
	        // {
	        //     if(options.verb == 'add'){

	        //         User.findOne(this.id).then(function(data){
	        //         console.log(data);
	        //         console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<);");
	        //             data.nbProjects= Number(data.nbProjects)+1;
	        //             data.total= Number(data.total)+1;
	        //             console.log(data);
	        //             return User.update(data.id ,
	        //             {
	        //                 nbProjects : data.nbProjects,
	        //                 total : data.total
	        //             }).then(function(result){
	        //                 console.log(result[0]);
	        //                 cb(null,result[0]); 
	        //                 User.publishUpdate( data.id , {
	        //                         nbProjects : data.nbProjects,
	        //                         total : data.total
	        //                 } )
	        //             })
	                   
	        //         }).catch(function (err) {
	        //             cb(err,null);
	        //         });
	        //     }
	  
	        //     if(options.verb == 'remove'){

	        //       User.findOne(this.id).then(function(data){
	        //             data.nbProjects= Number(data.nbProjects) -1;
	        //             data.total= Number(data.total) -1;
	                    
	        //                 return User.update(data.id ,
	        //                 {
	        //                     nbProjects : data.nbProjects,
	        //                     total : data.total
	        //                 }).then(function(result){
	        //                     User.publishUpdate( data.id , {
	        //                         nbProjects : data.nbProjects,
	        //                         total : data.total
	        //                     } )
	        //                     cb(null,result[0]);
	        //                 })

	                   
	        //         }).catch(function (err) {
	        //             cb(err,null);
	        //         });
	        //     } 
	        
	    }
		
	},
	beforeDestroy: function (value, callback){
        console.log('BEFORE SLIDE DESTROY');
        console.log(value.where.id);
        var id = value.where.id
        Slide.findOne(id).populateAll().then(function(data){
        	console.log(data);
        	var imgsToDestroy = data.images.map(function(img) {
                return Image.destroy(img.id);
            });

            var docsToDestroy = data.documents.map(function(img) {
                return Document.destroy(img.id);
            });

            return Promise.all(imgsToDestroy)
              .then(function() {
                return Promise.all(docsToDestroy)
                  .then(function() {
                        callback()
                      // return article;
                })
            })
        	
        })
    },
    afterCreate: function (value, callback){
      console.log('afterCreate SLIDE');

        es.create('slide',value).then(function(){
            return callback()
        }).catch(function(err){
               console.log(err);
        })
 
    },
    afterUpdate: function (value, callback){
        console.log('after UPDATE SLIDE');

        es.update('slide',value).then(function(){
            return callback()
        }).catch(function(err){
               console.log(err);
        })
    },
  	afterDestroy: function (value, callback){
        console.log('AFTER SLIDE DESTROY');
        console.log(value);
        es.delete('slide',value[0]).then(function(){
            return callback()
        }).catch(function(err){
               console.log(err);
        })
    }
};

