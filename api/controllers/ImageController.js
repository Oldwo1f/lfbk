/**
 * ImageController
 *
 * @description :: Server-side logic for managing images
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs = require('fs'), Writable = require('stream').Writable;
var sid = require('shortid');
var easyimg = require('easyimage');
var IsThere = require("is-there");
module.exports = {
	
	serveImage:function  (req,res,next) {
		var filePath = 'uploads/images/'+ req.params.size +'/'+ req.params.name;
		// +req.params.size+'/'
		// sails.log(filePath);
	    var stat = fs.statSync(filePath);
	    // setTimeout(function (argument) {
	    	res.writeHead(200, {
		        // 'Content-Type': 'image/',
		        'Content-Length': stat.size
		    });

		    var readStream = fs.createReadStream(filePath);
		    readStream.pipe(res);
	    // },500)
	    
	},	
	resizeImage:function  (req,res,next) {
		console.log('resizeImage resizeImage resizeImage resizeImage resizeImage resizeImage resizeImage');
		// var info;
		console.log(req.body);
		easyimg.info('uploads/images/originalSize/'+req.body.filename).then(function(file) {
				info = file;
				console.log(info);
				var quality = 100;

				if(info.size > 300000){ quality = 90;}
				if(info.size > 500000){ quality = 80;}
				if(info.size > 700000){ quality = 70;}
				if(info.size > 1000000){ quality = 50;}
				if(info.size > 2000000){ quality = 30;}


console.log('quality =' +quality);
		    	easyimg.rescrop({
		    		 gravity:'NorthWest',
				     src:'uploads/images/originalSize/'+req.body.filename, dst:'uploads/images/resized/'+req.body.filename,
				     width:file.width, height:file.height,
				     cropwidth:req.body.scaledWidth, cropheight:req.body.scaledHeight,
				     x:req.body.scaledLeft, y:req.body.scaledTop, quality:quality
				}).then(function(image) {

					console.log(req.body.normalWidth + '---' + req.body.normalHeight);
					easyimg.rescrop({
			    		 gravity:'NorthWest',
					     src:'uploads/images/resized/'+req.body.filename, dst:'uploads/images/resized2/'+req.body.filename,
					     width:req.body.normalWidth, height:req.body.normalHeight,
					     // cropwidth:req.body.normalWidth, cropheight:req.body.normalHeight,
					     // x:req.body.scaledLeft, y:req.body.scaledTop,
					      quality:100
					}).then(function(image) {
						

						if(req.body.imgid)
						{
							console.log('ttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt ');
							console.log(image);
							var paysage = true;
							if(image.width < image.height)
								paysage = false;

							Image.update(req.body.imgid,{width:image.width,height:image.height,size:image.size,paysage:paysage}).then(function(){
								
								Image.publishUpdate(req.body.imgid,{width:image.width,height:image.height,size:image.size,filename:req.body.filename})
								res.ok('resized')
							})

						}
						
					},function (err) {
					    console.log(err);
					});
					
				},function (err) {
				    console.log(err);
				});









		  	}, function (err) {
		    	console.log(err);
		  	}
		);


		

	},	
	resizeImageProfile:function  (req,res,next) {

		console.log('resize image profile');

		easyimg.info('uploads/images/originalSize/'+req.body.filename).then(function(file) {

		    	easyimg.rescrop({
		    		 gravity:'NorthWest',
				     src:'uploads/images/originalSize/'+req.body.filename, dst:'uploads/images/resized/'+req.body.filename,
				     width:file.width, height:file.height,
				     cropwidth:req.body.scaledWidth, cropheight:req.body.scaledHeight,
				     x:req.body.scaledLeft, y:req.body.scaledTop
				}).then(function(image) {
					
						console.log('ttttttttteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeetttttttttttttttttttttttttttttttttttttttttttttttttt');
						console.log(req.body.imageId);
						easyimg.resize({
				    		 gravity:'NorthWest',
						     src:'uploads/images/resized/'+req.body.filename, dst:'uploads/images/profile/'+req.body.filename,
						     width:150, height:150,
						}).then(function(img){
							
							
						})
					if(req.body.imageId)
					{
						Image.publishUpdate(req.body.imageId,{'filename' : req.body.filename})
						res.ok('resized')
					}else{
						res.ok('noresized2')
					}
					
				},function (err) {
				    console.log(err);
				}
				);
		  	}, function (err) {
		    	console.log(err);
		  	}
		);


		

	},
};

