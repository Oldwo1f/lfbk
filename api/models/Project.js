/**
 * Project.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var Promise = require('bluebird');

module.exports = {
	schema: true,
    attributes: {
  		lang : {type:'string',defaultsTo:'fr'},
  		title : {type:'string'},
    	content : {type:'text',defaultsTo:''},
    	shortcontent : {type:'text',defaultsTo:null},
    	description : {type:'text',defaultTso:null},
    	rewriteurl : {type:'string',defaultsTo:null},
    	keyword : {type:'string',defaultsTo:null},
  		date : {type:'datetime',required:true},
  		nbView : {type:'integer',defaultsTo:0},
  		status : {type:'string',required:true},
        activeComent:{type:'boolean',defaultsTo:false},
        privateContent:{type:'boolean',defaultsTo:false},
        videoUrl:{type:'text',defaultsTo:null},
        videoHost:{type:'text',defaultsTo:null},
        categories:{collection:'category', via: 'projects',dominant:true},

        // categorie: {collection: 'categoryArticle',defaultsTo:[]},
        tags:{collection:'tag', via: 'projects',dominant:true},
        documents:{collection:'document',defaultsTo:[]},
        images:{collection:'image',defaultsTo:[]},
  		authors:{collection:'user',defaultsTo:[]},
        comments: {
          collection: 'comment',
          via:'project'
        },
    },
    
    afterDestroy: function (value, callback){
        console.log('AFTER ARTICLE DESTROY');
        console.log(value);
        es.delete('project',value[0]).then(function(){
            return callback()
        }).catch(function(err){
               console.log(err);
        })
    },
    beforeDestroy: function (value, callback){
        console.log('BEFORE PROJECT DESTROY');
        console.log(value.where.id);
        var id = value.where.id
        Project.findOne(id).populateAll().then(function(data){
            console.log(data);
            var imgsToDestroy = data.images.map(function(img) {
                return Image.destroy(img.id);
            });
            var docsToDestroy = data.documents.map(function(img) {
                return Document.destroy(img.id);
            });
            var TagsUpdate = data.tags.map(function(tag) {
                if(tag.total-1 <=0){
                    return Tag.destroy(tag.id).then(function(data){
                        console.log('TAGDESROY -- ARTICLE destroy');
                        console.log(data);
                    });
                }else{
                    return Tag.update(tag.id,{nbProjects:tag.nbProjects-1,total:tag.total-1});
                }
            });
            var CategoriesUpdate = data.categories.map(function(cat) {
               if(cat.total-1 <=0){
                    return Category.destroy(cat.id).then(function(data){
                        console.log('Category destroy -- ARTICLE destroy');
                        console.log(data);
                    });
                }else{
                    return Category.update(cat.id,{nbProjects:cat.nbProjects-1,total:cat.total-1});
                }
            });

            return Promise.all(imgsToDestroy)
              .then(function() {
                return Promise.all(docsToDestroy)
                  .then(function() {
                       
                    return Promise.all(TagsUpdate)
                      .then(function() {
                           return Promise.all(CategoriesUpdate)
                      .then(function() {
                            callback()
                    })
                    })
                })
            })
            
        })
    }
};


