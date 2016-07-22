/**
 * ArticleController
 *
 * @description :: Server-side logic for managing articles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Promise = require('bluebird');
var fs = require('fs'), Writable = require('stream').Writable;
var sid = require('shortid');
var easyimg = require('easyimage');
var IsThere = require("is-there");
module.exports = {
		fetch:function(req,res,next){
			
			var articlesPromise = Article.find().sort(req.params.sort)
		    .skip(req.params.page).limit(req.params.limit).populateAll();

			articlesPromise
		    .then(function(articles) {   
		        var articlesWithAuthorsPromises = articles.map(function(article) {
		            var authorsPromises = article.authors.map(function(author) {
		                return User.findOne(author.id).populateAll();
		            });

		            return Promise.all(authorsPromises)
		                  .then(function(fullfilledAuthors) {
		                  	  article = article.toObject()
		                      article.authors = fullfilledAuthors;
		                      return article;
		                   })
		        })

		        return Promise.all(articlesWithAuthorsPromises)
		    })
		   .then(function(fullData) {
		   	var ids = _.map(fullData,'id')
		   		Article.subscribe(req,ids)
		   		Article.watch(req)
		        res.send(fullData)
		    })
		    .catch(function(e){
		    	console.log('ERRRRRRRRRRRRRRRRRRRRRRRRRROR');
		    	console.log(e);
		    })


			
		},
		fetchActive:function(req,res,next){
			
			var articlesPromise = Article.find({status:'actif'}).sort(req.params.sort)
		    .skip((req.params.page-1)*req.params.limit).limit(req.params.limit).populateAll();

			articlesPromise
		    .then(function(articles) {   
		        var articlesWithAuthorsPromises = articles.map(function(article) {
		            var authorsPromises = article.authors.map(function(author) {
		                return User.findOne(author.id).populateAll();
		            });

		            return Promise.all(authorsPromises)
		                  .then(function(fullfilledAuthors) {
		                  	  article = article.toObject()
		                      article.authors = fullfilledAuthors;
		                      return article;
		                   })
		        })

		        return Promise.all(articlesWithAuthorsPromises)
		    })
		   .then(function(fullData) {
		        res.send(fullData)
		        var ids = _.map(fullData,'id')
		   		Article.subscribe(req,ids)
		    })
		    .catch(function(e){
		    	console.log('ERRRRRRRRRRRRRRRRRRRRRRRRRROR');
		    	console.log(e);
		    })


			
		},
		fetchOne:function(req,res,next){
			
			console.log('FETCH');
			console.log(req.params);
			var result ;
			var idsCom ;
			Article.findOne(req.params.id).populateAll().then(function(article){
				console.log('HERE');
				console.log(article);
				// console.log(typeof(article.authors));
				var art=_.cloneDeep(article);
				return new Promise(function(resolve,reject){
					
						if(typeof(article.authors) != 'undefined'){

							console.log('HERE2');
							console.log('AUTHOR');

							return Promise.map(article.authors,function(author){

								return User.findOne(author.id).populateAll()
								
							}).then(function(t){
								console.log('AFTERMAP');
								// console.log(t);
								art.authors = t;
								// console.log(art);
								resolve(art)
							})
							// 
						}else
						{
							console.log('HERE3');
							resolve(article)
						}
				}).then(function(){
					
					idsCom = _.map(art.comments,function(o){return o.id})
					return Comment.find(idsCom).populate('responses')
					
					
				})
				.then(function(CommentsFullFilled){
					
					art.comments = CommentsFullFilled;
					console.log(idsCom);
					var idsToAdd = _.map(CommentsFullFilled,function(com){
						return _.map(com.responses,function(o){
							idsCom.push(o.id)
						return o.id
						})
					})
					console.log(idsCom);
					// var idsCom = _.map(art.comments,function(o){return o.id})
					Comment.subscribe(req,idsCom);
				 	Article.subscribe(req, art.id);
					res.send(art)
				})
			})
		},
		uploadDocument:function(req,res,next) {
			console.log(req.file);
			console.log('-------------');
			console.log(req.file('files'));
		res.setTimeout(0);
		sid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
		sid.seed(10);
		// var stuff = JSON.parse(req.body.resizeStuff);

		var reciever = new Writable({objectMode: true});
		reciever._write = function(file, enc, cb) {
			file.filename=safeFilename(sid.generate()+'-'+file.filename)
			var output = require('fs').createWriteStream('.tmp/uploads/'+file.filename);

			var transfert = file.pipe(output);
			transfert.on('finish', function () {
				cb();
			});
		};
		var pat= /\w+\/[-+.\w]+/g

		req.file('files').upload(reciever,function (err, files) {
	      if (err) return res.serverError(err);

	      console.log(files);


	      if(pat.test(files[0].type))
	      {
			    try{
	      			fs.mkdirSync('uploads/files');
      			}
      			catch(e){
      			}

			    		var file = files[0];
			    		var ext = file.filename.substring(file.filename.lastIndexOf('.'),file.filename.length)
			    		file.name = file.filename.substring(file.filename.indexOf('-')+1,file.filename.lastIndexOf('.'))
			    		// file.description = file.filename.substring(file.filename.indexOf('-')+1,file.filename.lastIndexOf('.'))
			    		var nameOk=true
						var index=0;
						var suffix='';
						var goodname='';
						while(nameOk)
						{
							suffix='('+index+')';
							if(index==0)
								suffix='';
							var exists = IsThere('uploads/files/'+file.name+suffix+ext)
							if (exists) {
							    index++
							} else {
								nameOk=false;
							    goodname=file.name+suffix+ext;
							}
						}
			    		
			    		var tmpname =file.filename;
			    		goodname = safeFilename(goodname);
			    		fs.writeFileSync('uploads/files/'+goodname,fs.readFileSync('.tmp/uploads/'+tmpname));
			    		
			    		file.filename = goodname;
			    		// file.description = '';
			    		file.nbDowload = 0
			    		file.date = new Date();



				    		// console.log(results[0]);
			    		Document.create(file).exec(function(err,doc) {
					   					
					   		console.log('FILE CREATED');
					   		console.log(doc.id);
					   		req.secondid = doc.id		
					   		req.params.toto = doc.id		
					   		req.params.tata = 'doc.id'		
			    			next();
			    		});

				    	fs.unlinkSync('.tmp/uploads/'+tmpname)

	      }else
	      {
	      	//NOT an IMAGE
	      	return res.json({
		        message: 'Ce fichier n\'est pas une image',
		        files: files
		      });
	      }
	    });




		function safeFilename(name) {
			name = name.replace(/[éè]/g, 'e');
			name = name.replace(/à/g, 'a');
			name = name.replace(/[îï]/g, 'i');
			name = name.replace(/[ûüù]/g, 'u');
			name = name.replace(/[ôö]/g, 'o');
			name = name.replace(/[ç]/g, 'c');
			name = name.replace(/ /g, '-');
			name = name.replace(/[^A-Za-z0-9-_\.()]/g, '');
			name = name.replace(/\.+/g, '.');
			name = name.replace(/-+/g, '-');
			name = name.replace(/_+/g, '_');
			return name;
		}

	},
	uploadImage:function(req,res,next) {

		console.log(req.body);
var cropOptions = req.body
		res.setTimeout(0);
		sid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
		sid.seed(10);
		// var stuff = JSON.parse(req.body.resizeStuff);

		var reciever = new Writable({objectMode: true});
		reciever._write = function(file, enc, cb) {
			file.filename=safeFilename(sid.generate()+'-'+file.filename)
			var output = require('fs').createWriteStream('.tmp/uploads/'+file.filename);

			var transfert = file.pipe(output);
			transfert.on('finish', function () {
				cb();
			});
		};
		var pat= /(gif|jpg|jpeg|tiff|png)$/i

		req.file('file').upload(reciever,function (err, files) {
	      if (err) return res.serverError(err);


	    if(pat.test(files[0].type)) 
	    {

	

			    		var file = files[0];
			    		var ext = file.filename.substring(file.filename.lastIndexOf('.'),file.filename.length)
			    		file.name = file.filename.substring(file.filename.indexOf('-')+1,file.filename.lastIndexOf('.'))
			    		// file.description = file.filename.substring(file.filename.indexOf('-')+1,file.filename.lastIndexOf('.'))
			    		var nameOk=true
						var index=0;
						var suffix='';
						var goodname='';
						while(nameOk)
						{
							suffix='('+index+')';
							if(index==0)
								suffix='';
							var exists = IsThere('uploads/images/originalSize/'+file.name+suffix+ext)
							if (exists) {
							    index++
							} else {
								nameOk=false;
							    goodname=file.name+suffix+ext;
							}
						}
			    		
			    		var tmpname =file.filename;
			    		goodname = safeFilename(goodname);
			    		fs.writeFileSync('uploads/images/originalSize/'+goodname,fs.readFileSync('.tmp/uploads/'+tmpname));
			    		
			    		file.filename = goodname;
			    		// file.description = '';
			    		file.nbDowload = Math.round(Math.random()*100)
			    		file.date = new Date();

			    		console.log('----------------------------------------------------------------------------------------------------------------------');
			    		console.log(cropOptions);
			    		easyimg.thumbnail({
						     src:'.tmp/uploads/'+tmpname, dst:'uploads/images/adminThumbs/'+goodname,
						     width:400, height:400,
						     // cropwidth:128, cropheight:128,
						     // x:0, y:0
						  }).then(function(image){
						  	
						  	console.log('image ReSIZED');
						  		console.log(image);

						  		Image.create(file).exec(function(err,img) {
							   					
							   		console.log('FILE CREATED');
							   		console.log(img.id);
							   		req.secondid = img.id		
						    		fs.unlinkSync('.tmp/uploads/'+tmpname)
					    			next();
					    		});
						  },function(err){
						  		console.log(err);
						  })


				    		// console.log(results[0]);
			    		


	      }else
	      {
	      	//NOT an IMAGE
	      	return res.json({
		        message: 'Ce fichier n\'est pas une image',
		        files: files
		      });
	      }
	    });




		function safeFilename(name) {
			name = name.replace(/[éè]/g, 'e');
			name = name.replace(/à/g, 'a');
			name = name.replace(/[îï]/g, 'i');
			name = name.replace(/[ûüù]/g, 'u');
			name = name.replace(/[ôö]/g, 'o');
			name = name.replace(/[ç]/g, 'c');
			name = name.replace(/ /g, '-');
			name = name.replace(/[^A-Za-z0-9-_\.()]/g, '');
			name = name.replace(/\.+/g, '.');
			name = name.replace(/-+/g, '-');
			name = name.replace(/_+/g, '_');
			return name;
		}

	},
	search:function(req,res,next){
		console.log('SEARCHff');

		console.log(req.params);


		es.search(req.params.slug,'article').then(function(data){
			console.log('FIN');
			console.log(data.hits);
			var datas = _.map(data.hits.hits, '_source');
			var datasIds = _.map(datas, 'id');
			console.log(datasIds);
			new Promise.map(datasIds, function(id){
				console.log('-------'+id);
				// return id
				return Article.findOne(id).populateAll().then(function(article){
					console.log(article);
					Article.subscribe(req,id)
					var authorsPromises = article.authors.map(function(author) {
		                return User.findOne(author.id).populateAll();
		            });

		            return Promise.all(authorsPromises)
                  	.then(function(fullfilledAuthors) {
                  	  article = article.toObject()
                      article.authors = fullfilledAuthors;
                      return article;
                   	})
				})
			}).then(function(finaldata){
				console.log(finaldata);
				res.send(finaldata)
				
			





			});

			
			// res.send(datas)

            // return callback()
        }).catch(function(err){
               console.log(err);
        })


		
	}
};

