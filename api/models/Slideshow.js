/**
 * Slideshow.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var Promise = require('bluebird');
var fs = require('fs'), Writable = require('stream').Writable;

module.exports = {
// schema: true,
  	attributes: {
  		title : {type:'string',required:true},
    	width : {type:'int',required:true},
    	height : {type:'int',required:true},
    	// shortcontent : {type:'text',defaultsTo:null},
    	slides : {
          collection: 'slide',
          via:'slideshow'
        },
  	},
  	beforeDestroy: function (value, callback){
        console.log('BEFORE SLIDESHOW DESTROY');
        console.log(value.where.id);
        var id = value.where.id
        Slideshow.findOne(id).populateAll().then(function(data){
        	console.log(data);
        	var slidesToDestroy = data.slides.map(function(slide) {
                return Slide.destroy(slide.id);
            });

            return Promise.all(slidesToDestroy)
	          .then(function() {
	          		callback()
	              // return article;
	        })
        	
        })
    },
  	afterDestroy: function (value, callback){
        console.log('AFTER SLIDESHOW DESTROY');
        console.log(value);
        es.delete('slideshow',value[0]).then(function(){
            return callback()
        }).catch(function(err){
               console.log(err);
        })
    }
};

