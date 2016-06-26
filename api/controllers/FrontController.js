var moment = require('moment')
var truncate = require('html-truncate');
/**
 * FrontController
 *
 * @description :: Server-side logic for managing fronts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = { 
	home:function(req,res,next){
		req.locale = req.locale || 'en'
		moment.locale(req.locale);

		var articlesPromise = Article.find({status:'actif'}).sort('date DESC')
	    .limit(4).populateAll();

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
	                      article.content = truncate(article.content, 250)
	                      return article;
	                   })
	        })

	        return Promise.all(articlesWithAuthorsPromises)
	    })
	   .then(function(articles) {
	   		
	   		// result.articles = articles
	   		
	   		
	   		res.status(200).view('front/index',{
				// articles:articles,
				articles: articles,
				title: req.__('SEO_HOME_title'),
				keyword: req.__('SEO_HOME_keyword'),
				description:req.__('SEO_HOME_description'),
				scripturl:'home.js',
				menu:'home',
				baseurl:'',

			})


	    })

		
	},
	article:function(req,res,next){
		console.log(req.params.id);
		moment.locale(req.locale);
		// baseurl='/'
		// if(req.params.page){
			baseurl='/../'
			// page = req.params.page;
		// }
		var result = {};

		

		Article.findOne(req.params.id).populate('images').populate('authors').populate('categories').populate('documents').populate('comments',{where:{'status':'actif'}})
	    .then(function(article) {
	    	var newnbView = Number(article.nbView) + 1 ; 

	    	console.log(article.nbView +'_____>>>>>'+newnbView);
	    	article.nbView = newnbView
	    	result.tmparticle = article
	    	return Article.update(req.params.id,{nbView:newnbView})
	    		
	    })
	    .then(function(article) {  
	    	article = result.tmparticle
	    	// console.log(article);

	            var authorsPromises = article.authors.map(function(author) {
	                return User.findOne(author.id).populateAll();
	            });
	            return Promise.all(authorsPromises)
	                  .then(function(fullfilledAuthors) {
	                  	  article = article.toObject()
	                      article.authors = fullfilledAuthors;
	                      // article.content = truncate(article.content, 250)
	                      return article;
	                   })
	        

	    })
	    .then(function(article) {   
	   		result.article = article

	            var comPromises = result.article.comments.map(function(com) {
	                return Comment.findOne(com.id).populateAll();
	            });
	            return Promise.all(comPromises)
	                  .then(function(fullfilled) {
	                  	  // article = article.toObject()
	                      result.article.comments = fullfilled;
	                      // article.content = truncate(article.content, 250)
	                      return article;
	                   })
	        

	    })
	   .then(function(article) {
	   		
	   		result.article = article
	   		
	   		return Article.find({status:'actif'}).populate('images').sort('nbView DESC')
	    	.limit(5)



	    })
	   .then(function(mostseen) {
	   		
	   		result.mostseen = mostseen
	   		
	   		return Category.find({ nbArticles: { '!': '0' }}).sort('name ASC')



	    })
	   .then(function(categories) {
	   		
	   		result.categories = categories
	   		
	   		return Tag.find({ nbArticles: { '!': '0' }}).sort('name ASC')



	    }).then(function(tags){

			result.tags = tags	    	

	    	res.status(200).view('front/article',{
				article:result.article,
				title: result.article.title,
				keyword: result.article.keyword,
				description:result.article.description,
				scripturl:'blog.js',
				menu:'blog',
				// nbPage:nbPage,
				thiscategory:null,
				mostseen:result.mostseen,
				tags:result.tags,
				categories:result.categories,
				moment: moment,
				baseurl:baseurl
			})
	    })
	    .catch(function(e){
	    	console.log('ERRRRRRRRRRRRRRRRRRRRRRRRRROR');
	    	console.log(e);
	    })
		
	},
	blog:function(req,res,next){
		req.locale = req.locale || 'en'
		moment.locale(req.locale);
		var page = 1;
		// nbperpage = 2;
		baseurl='/'
		if(req.params.page){
			baseurl='/../'
			page = req.params.page;
		}
		var result = {};

		var articlesPromise = Article.find({status:'actif'}).sort('date DESC')
	    .limit(100).populateAll();

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
	                      article.content = truncate(article.content, 250)
	                      return article;
	                   })
	        })

	        return Promise.all(articlesWithAuthorsPromises)
	    })
	   .then(function(articles) {
	   		
	   		result.articles = articles
	   		
	   		return Article.find({status:'actif'}).populate('images').sort('nbView DESC')
	    	.limit(5)



	    })
	   .then(function(mostseen) {
	   		
	   		result.mostseen = mostseen
	   		
	   		return Category.find({ nbArticles: { '!': '0' }}).sort('name ASC')



	    })
	   .then(function(categories) {
	   		
	   		result.categories = categories
	   		
	   		return Tag.find({ nbArticles: { '!': '0' }}).sort('name ASC')



	    }).then(function(tags){

			result.tags = tags	    	

	    	res.status(200).view('front/blog',{
				articles:result.articles,
				title: req.__('SEO_BLOG_title'),
				keyword: req.__('SEO_BLOG_keyword'),
				description:req.__('SEO_BLOG_description'),
				scripturl:'blog.js',
				menu:'blog',
				// nbPage:nbPage,
				thiscategory:null,
				mostseen:result.mostseen,
				tags:result.tags,
				categories:result.categories,
				moment: moment,
				baseurl:baseurl
			})
	    })
	    .catch(function(e){
	    	console.log('ERRRRRRRRRRRRRRRRRRRRRRRRRROR');
	    	console.log(e);
	    })
		
			




	},
	categoryArticle:function(req,res,next){
		console.log('CATEGORY====>',req.params.thiscat);
		req.locale = req.locale || 'en'
		moment.locale(req.locale);
		var page = 1;
		// nbperpage = 2;
		baseurl='/'
		if(req.params.page){
			baseurl='/../'
			page = req.params.page;
		}
		var result = {};

		Category.findOne(req.params.thiscat).populate('articles')

		.then(function(cat){
			console.log(cat);
				// console.log(cat.articles);
				var articlesIds = _.map(cat.articles,function(o){ return o.id})
				console.log(articlesIds);
				return Article.find({id: articlesIds , status:'actif'})
				.sort('date DESC').limit(100).populateAll();
		})
	    .then(function(articles) {   
	        var articlesWithAuthorsPromises = articles.map(function(article) {
	            var authorsPromises = article.authors.map(function(author) {
	                return User.findOne(author.id).populateAll();
	            });

	            return Promise.all(authorsPromises)
	                  .then(function(fullfilledAuthors) {
	                  	  article = article.toObject()
	                      article.authors = fullfilledAuthors;
	                      article.content = truncate(article.content, 250)
	                      return article;
	                   })
	        })

	        return Promise.all(articlesWithAuthorsPromises)
	    })
	   .then(function(articles) {
	   		
	   		result.articles = articles
	   		
	   		return Article.find({status:'actif'}).populate('images').sort('nbView DESC')
	    	.limit(5)



	    })
	   .then(function(mostseen) {
	   		
	   		result.mostseen = mostseen
	   		
	   		return Category.find({nbArticles: { '!': '0' }}).sort('name ASC')



	    })
	   .then(function(categories) {
	   		
	   		result.categories = categories
	   		
	   		return Category.findOne(req.params.thiscat).populate('images')



	    }).then(function(thiscat) {
	   		
	   		result.thiscat = thiscat
	   		
	   		return Tag.find({ nbArticles: { '!': '0' }}).sort('name ASC')



	    }).then(function(tags){

			result.tags = tags	    	

			console.log('HEHEHEHEHEHEHEHEHHEE');
	    	res.status(200).view('front/blog',{
				articles:result.articles,
				title: req.__('SEO_BLOG_title'),
				keyword: req.__('SEO_BLOG_keyword'),
				description:req.__('SEO_BLOG_description'),
				scripturl:'blog.js',
				menu:'blog',
				// nbPage:nbPage,
				thiscategory:result.thiscat,
				mostseen:result.mostseen,
				tags:result.tags,
				categories:result.categories,
				moment: moment,
				baseurl:baseurl
			})
	    })
	    .catch(function(e){
	    	console.log('ERRRRRRRRRRRRRRRRRRRRRRRRRROR');
	    	console.log(e);
	    })
		
			




	},
	tagArticle:function(req,res,next){
		console.log('tags====>',req.params.thiscat);
		req.locale = req.locale || 'en'
		moment.locale(req.locale);
		var page = 1;
		// nbperpage = 2;
		baseurl='/'
		if(req.params.page){
			baseurl='/../'
			page = req.params.page;
		}
		var result = {};

		Tag.findOne(req.params.thiscat).populate('articles')

		.then(function(cat){
			console.log(cat);
				// console.log(cat.articles);
				var articlesIds = _.map(cat.articles,function(o){ return o.id})
				console.log(articlesIds);
				return Article.find({id: articlesIds , status:'actif'})
				.sort('date DESC').limit(100).populateAll();
		})
	    .then(function(articles) {   
	        var articlesWithAuthorsPromises = articles.map(function(article) {
	            var authorsPromises = article.authors.map(function(author) {
	                return User.findOne(author.id).populateAll();
	            });

	            return Promise.all(authorsPromises)
	                  .then(function(fullfilledAuthors) {
	                  	  article = article.toObject()
	                      article.authors = fullfilledAuthors;
	                      article.content = truncate(article.content, 250)
	                      return article;
	                   })
	        })

	        return Promise.all(articlesWithAuthorsPromises)
	    })
	   .then(function(articles) {
	   		
	   		result.articles = articles
	   		
	   		return Article.find({status:'actif'}).populate('images').sort('nbView DESC')
	    	.limit(5)



	    })
	   .then(function(mostseen) {
	   		
	   		result.mostseen = mostseen
	   		
	   		return Category.find({nbArticles: { '!': '0' }}).sort('name ASC')



	    })
	   .then(function(categories) {
	   		
	   		result.categories = categories
	   		
	   		return Tag.find({ nbArticles: { '!': '0' }}).sort('name ASC')



	    }).then(function(tags){

			result.tags = tags	    	

			console.log('TAGSARTICLE  END');


	    	res.status(200).view('front/blog',{
				articles:result.articles,
				title: req.__('SEO_BLOG_title'),
				keyword: req.__('SEO_BLOG_keyword'),
				description:req.__('SEO_BLOG_description'),
				scripturl:'blog.js',
				menu:'blog',
				tags:result.tags,
				// nbPage:nbPage,
				thiscategory:null,
				mostseen:result.mostseen,
				categories:result.categories,
				moment: moment,
				baseurl:baseurl
			})
	    })
	    .catch(function(e){
	    	console.log('ERRRRRRRRRRRRRRRRRRRRRRRRRROR');
	    	console.log(e);
	    })
		
			




	},
	addCommentArticle:function(req,res,next){

		console.log('addCommentArticle');
		console.log(req.params.itemid);

		console.log(req.body);
		// var commentToCreate =req.body;

		Article.findOne(req.params.itemid)
		.then(function(article){
			
			article.comments.add(req.body)
			return article.save()	

		}).then(function(d){
				res.status(200).send('OK')
			
		})
		
	},
	project:function(req,res,next){
		console.log(req.params.id);
		moment.locale(req.locale);
		// baseurl='/'
		// if(req.params.page){
			baseurl='/../'
			// page = req.params.page;
		// }
		var result = {};



		Project.findOne(req.params.id).populate('images').populate('authors').populate('categories').populate('documents').populate('comments',{where:{'status':'actif'}})
	    .then(function(project) {   
	    	var newnbView = project.nbView + 1
	    	project.nbView = newnbView
	    	result.project = project
	    	return Project.update(req.params.id,{nbView:newnbView})
	    })
	    .then(function(project) {  

	    	console.log(project);
 			project = result.project
	            var authorsPromises = project.authors.map(function(author) {
	                return User.findOne(author.id).populateAll();
	            });
	            return Promise.all(authorsPromises)
	                  .then(function(fullfilledAuthors) {
	                  	  project = project.toObject()
	                      project.authors = fullfilledAuthors;
	                      // project.content = truncate(project.content, 250)
	                      return project;
	                   })
	        

	    })
	    .then(function(project) {   
	   		result.project = project

	            var comPromises = result.project.comments.map(function(com) {
	                return Comment.findOne(com.id).populateAll();
	            });
	            return Promise.all(comPromises)
	                  .then(function(fullfilled) {
	                  	  // project = project.toObject()
	                      result.project.comments = fullfilled;
	                      // project.content = truncate(project.content, 250)
	                      return project;
	                   })
	        

	    })
	   .then(function(project) {
	   		
	   		result.project = project
	   		
	   		return Project.find({status:'actif'}).populate('images').sort('nbView DESC')
	    	.limit(5)



	    })
	   .then(function(mostseen) {
	   		
	   		result.mostseen = mostseen
	   		
	   		return Category.find({ nbProjects: { '!': '0' }}).sort('name ASC')



	    })
	   .then(function(categories) {
	   		
	   		result.categories = categories
	   		
	   		return Tag.find({ nbProjects: { '!': '0' }}).sort('name ASC')



	    }).then(function(tags){

			result.tags = tags	    	

	    	res.status(200).view('front/project',{
				project:result.project,
				title: result.project.title,
				keyword: result.project.keyword,
				description:result.project.description,
				scripturl:'blog.js',
				menu:'portfolio',
				// nbPage:nbPage,
				thiscategory:null,
				mostseen:result.mostseen,
				tags:result.tags,
				categories:result.categories,
				moment: moment,
				baseurl:baseurl
			})
	    })
	    .catch(function(e){
	    	console.log('ERRRRRRRRRRRRRRRRRRRRRRRRRROR');
	    	console.log(e);
	    })
		
	},
	portfolio:function(req,res,next){
		req.locale = req.locale || 'en'
		moment.locale(req.locale);
		var page = 1;
		// nbperpage = 2;
		baseurl='/'
		if(req.params.page){
			baseurl='/../'
			page = req.params.page;
		}
		var result = {};

		var projectsPromise = Project.find({status:'actif'}).sort('date DESC')
	    .limit(100).populateAll();

		projectsPromise
	    .then(function(projects) {   
	        var projectsWithAuthorsPromises = projects.map(function(project) {
	            var authorsPromises = project.authors.map(function(author) {
	                return User.findOne(author.id).populateAll();
	            });

	            return Promise.all(authorsPromises)
	                  .then(function(fullfilledAuthors) {
	                  	  project = project.toObject()
	                      project.authors = fullfilledAuthors;
	                      project.content = truncate(project.content, 250)
	                      return project;
	                   })
	        })

	        return Promise.all(projectsWithAuthorsPromises)
	    })
	   .then(function(projects) {
	   		
	   		result.projects = projects
	   		
	   		return Project.find({status:'actif'}).populate('images').sort('nbView DESC')
	    	.limit(5)



	    })
	   .then(function(mostseen) {
	   		
	   		result.mostseen = mostseen
	   		
	   		return Category.find({ nbProjects: { '!': '0' }}).sort('name ASC')



	    })
	   .then(function(categories) {
	   		
	   		console.log(categories);
	   		result.categories = categories
	   		
	   		return Tag.find({ nbProjects: { '!': '0' }}).sort('name ASC')



	    }).then(function(tags){

			result.tags = tags	    	

	    	res.status(200).view('front/portfolio',{
				projects:result.projects,
				title: req.__('SEO_PROJECTS_title'),
				keyword: req.__('SEO_PROJECTS_keyword'),
				description:req.__('SEO_PROJECTS_description'),
				scripturl:'blog.js',
				menu:'portfolio',
				// nbPage:nbPage,
				thiscategory:null,
				mostseen:result.mostseen,
				tags:result.tags,
				categories:result.categories,
				moment: moment,
				baseurl:baseurl
			})
	    })
	    .catch(function(e){
	    	console.log('ERRRRRRRRRRRRRRRRRRRRRRRRRROR');
	    	console.log(e);
	    })
		
			




	},
	categoryProject:function(req,res,next){
		console.log('CATEGORY====>',req.params.thiscat);
		req.locale = req.locale || 'en'
		moment.locale(req.locale);
		var page = 1;
		// nbperpage = 2;
		baseurl='/'
		if(req.params.page){
			baseurl='/../'
			page = req.params.page;
		}
		var result = {};

		Category.findOne(req.params.thiscat).populate('projects')

		.then(function(cat){
			console.log(cat);
				// console.log(cat.projects);
				var projectsIds = _.map(cat.projects,function(o){ return o.id})
				console.log(projectsIds);
				return Project.find({id: projectsIds , status:'actif'})
				.sort('date DESC').limit(100).populateAll();
		})
	    .then(function(projects) {   
	        var projectsWithAuthorsPromises = projects.map(function(project) {
	            var authorsPromises = project.authors.map(function(author) {
	                return User.findOne(author.id).populateAll();
	            });

	            return Promise.all(authorsPromises)
	                  .then(function(fullfilledAuthors) {
	                  	  project = project.toObject()
	                      project.authors = fullfilledAuthors;
	                      project.content = truncate(project.content, 250)
	                      return project;
	                   })
	        })

	        return Promise.all(projectsWithAuthorsPromises)
	    })
	   .then(function(projects) {
	   		
	   		result.projects = projects
	   		
	   		return Project.find({status:'actif'}).populate('images').sort('nbView DESC')
	    	.limit(5)



	    })
	   .then(function(mostseen) {
	   		
	   		result.mostseen = mostseen
	   		
	   		return Category.find({nbProjects: { '!': '0' }}).sort('name ASC')



	    })
	   .then(function(categories) {
	   		
	   		result.categories = categories
	   		
	   		return Category.findOne(req.params.thiscat).populate('images')



	    }).then(function(thiscat) {
	   		
	   		result.thiscat = thiscat
	   		
	   		return Tag.find({ nbProjects: { '!': '0' }}).sort('name ASC')



	    }).then(function(tags){

			result.tags = tags	    	

			console.log('HEHEHEHEHEHEHEHEHHEE');
	    	res.status(200).view('front/portfolio',{
				projects:result.projects,
				title: req.__('SEO_PROJECTS_title'),
				keyword: req.__('SEO_PROJECTS_keyword'),
				description:req.__('SEO_PROJECTS_description'),
				scripturl:'blog.js',
				menu:'portfolio',
				// nbPage:nbPage,
				thiscategory:result.thiscat,
				mostseen:result.mostseen,
				tags:result.tags,
				categories:result.categories,
				moment: moment,
				baseurl:baseurl
			})
	    })
	    .catch(function(e){
	    	console.log('ERRRRRRRRRRRRRRRRRRRRRRRRRROR');
	    	console.log(e);
	    })
		
			




	},
	tagProject:function(req,res,next){
		console.log('tags====>',req.params.thiscat);
		req.locale = req.locale || 'en'
		moment.locale(req.locale);
		var page = 1;
		// nbperpage = 2;
		baseurl='/'
		if(req.params.page){
			baseurl='/../'
			page = req.params.page;
		}
		var result = {};

		Tag.findOne(req.params.thiscat).populate('projects')

		.then(function(cat){
			console.log(cat);
				// console.log(cat.projects);
				var projectsIds = _.map(cat.projects,function(o){ return o.id})
				console.log(projectsIds);
				return Project.find({id: projectsIds , status:'actif'})
				.sort('date DESC').limit(100).populateAll();
		})
	    .then(function(projects) {   
	        var projectsWithAuthorsPromises = projects.map(function(project) {
	            var authorsPromises = project.authors.map(function(author) {
	                return User.findOne(author.id).populateAll();
	            });

	            return Promise.all(authorsPromises)
	                  .then(function(fullfilledAuthors) {
	                  	  project = project.toObject()
	                      project.authors = fullfilledAuthors;
	                      project.content = truncate(project.content, 250)
	                      return project;
	                   })
	        })

	        return Promise.all(projectsWithAuthorsPromises)
	    })
	   .then(function(projects) {
	   		
	   		result.projects = projects
	   		
	   		return Project.find({status:'actif'}).populate('images').sort('nbView DESC')
	    	.limit(5)



	    })
	   .then(function(mostseen) {
	   		
	   		result.mostseen = mostseen
	   		
	   		return Category.find({nbProjects: { '!': '0' }}).sort('name ASC')



	    })
	   .then(function(categories) {
	   		
	   		result.categories = categories
	   		
	   		return Tag.find({ nbProjects: { '!': '0' }}).sort('name ASC')



	    }).then(function(tags){

			result.tags = tags	    	

			console.log('TAGSARTICLE  END');


	    	res.status(200).view('front/portfolio',{
				projects:result.projects,
				title: req.__('SEO_PROJECTS_title'),
				keyword: req.__('SEO_PROJECTS_keyword'),
				description:req.__('SEO_PROJECTS_description'),
				scripturl:'blog.js',
				menu:'portfolio',
				tags:result.tags,
				// nbPage:nbPage,
				thiscategory:null,
				mostseen:result.mostseen,
				categories:result.categories,
				moment: moment,
				baseurl:baseurl
			})
	    })
	    .catch(function(e){
	    	console.log('ERRRRRRRRRRRRRRRRRRRRRRRRRROR');
	    	console.log(e);
	    })
		
			




	},
	addCommentProject:function(req,res,next){

		console.log('addCommentProject');
		console.log(req.params.itemid);

		console.log(req.body);
		// var commentToCreate =req.body;

		Project.findOne(req.params.itemid)
		.then(function(project){
			
			project.comments.add(req.body)
			return project.save()	

		}).then(function(d){
				res.status(200).send('OK')
			
		})
		
	},
	contact:function(req,res,next){
		req.locale = req.locale || 'en'
		moment.locale(req.locale);
		console.log(res.i18n());

		res.status(200).view('front/contact',{
						title: req.__('SEO_CONTACT_title'),
						keyword: req.__('SEO_CONTACT_keyword'),
						description:req.__('SEO_CONTACT_description'),
						scripturl:'portfo.js',
						menu:'contact',
						baseurl:''

					})
	},	
	presta:function(req,res) {
			req.locale = req.locale || 'en'
			moment.locale(req.locale);
			return res.view('front/presta',{
				menu:'presta',
				scripturl:'portfo.js',
				baseurl:'',
				title:req.__('SEO_PRESTA_title'),
				keyword:req.__('SEO_PRESTA_KEYWORD'),
				description:req.__('SEO_PRESTA_DESCRIPTION')
			});
	},	
	infos:function(req,res) {
			req.locale = req.locale || 'en'
			moment.locale(req.locale);
			return res.view('front/infos',{
				menu:'presta',
				scripturl:'portfo.js',
				baseurl:'',
				title:req.__('SEO_INFOS_title'),
				keyword:req.__('SEO_INFOS_KEYWORD'),
				description:req.__('SEO_INFOS_DESCRIPTION')
			});
	},
	contactEmail:function(req,res,next) {

		console.log('contactEmailcontactEmailcontactEmailcontactEmailcontactEmailcontactEmail');
		console.log(req.body.message);
		console.log(req.body.name);
		console.log(req.body.email);
		if(req.body.message && req.body.name && req.body.email)
		{
			
			mail.sendEmail({
	             from: req.body.name+' <'+req.body.email+'>', // sender address
			    to: sails.config.mainEmailClient, // list of receivers
			    subject: 'Site - '+ sails.config.company +' - contact : '+ req.body.name +' - '+req.body.subject, // Subject line
			    text: 'Cet email a été envoyé par : ' + req.body.name + ' - ' + req.body.email+ ' \n\n ' + req.body.message // html body
	         }).then(function(data){
	            console.log('THEN IN TOTO');
	            res.status(200).send('mail sended');
	         }).catch(function(data){
	         	res.status(400).send('mail error');
	         });

	    }else{
			res.status(400).send('field error');
		}

	},
};

