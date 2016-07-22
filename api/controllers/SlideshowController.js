/**
 * SlideshowController
 *
 * @description :: Server-side logic for managing slideshows
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Promise = require('bluebird');
var fs = require('fs'), Writable = require('stream').Writable;

module.exports = {
		fetch:function(req,res,next){
			

			console.log('SLIDESHOWFETCH');


			var slideshowsPromise = Slideshow.find().limit(100).populateAll();

			slideshowsPromise
		    .then(function(slideshows) {   
		        var slideshowsWithSlidesPromises = slideshows.map(function(slideshow) {
		            var slidePromises = slideshow.slides.map(function(slide) {
		                return Slide.findOne(slide.id).populateAll();
		            });

		            return Promise.all(slidePromises)
		                  .then(function(fullfilledSlides) {
		                  	  slideshow = slideshow.toObject()
		                      slideshow.slides = fullfilledSlides;
		                      return slideshow;
		                   })
		        })

		        return Promise.all(slideshowsWithSlidesPromises)
		    })
		   .then(function(fullData) {
		   	var ids = _.map(fullData,'id')
		   		Slideshow.subscribe(req,ids)
		   		Slideshow.watch(req)
		        res.send(fullData)
		    })
		    .catch(function(e){
		    	console.log('ERRRRRRRRRRRRRRRRRRRRRRRRRROR');
		    	console.log(e);
		    })


			
		},
		fetchHome:function(req,res,next){
			

			console.log('SLIDESHOWFETCH');


			var slideshowsPromise = Slideshow.find().where({title:'home'}).populateAll();

			slideshowsPromise
		    .then(function(slideshows) {   
		        var slideshowsWithSlidesPromises = slideshows.map(function(slideshow) {
		            var slidePromises = slideshow.slides.map(function(slide) {
		                return Slide.findOne(slide.id).populateAll();
		            });

		            return Promise.all(slidePromises)
		                  .then(function(fullfilledSlides) {
		                  	  slideshow = slideshow.toObject()
		                      slideshow.slides = fullfilledSlides;
		                      return slideshow;
		                   })
		        })

		        return Promise.all(slideshowsWithSlidesPromises)
		    })
		   .then(function(fullData) {
		   	var ids = _.map(fullData,'id')
		   		Slideshow.subscribe(req,ids)
		   		Slideshow.watch(req)
		        res.send(fullData[0])
		    })
		    .catch(function(e){
		    	console.log('ERRRRRRRRRRRRRRRRRRRRRRRRRROR');
		    	console.log(e);
		    })


			
		}
};

