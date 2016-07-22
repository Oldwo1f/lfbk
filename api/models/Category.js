/**
 * Category.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  	schema: true,
  	attributes: {
  		name:{type:'string',required:true},
  		textColor:{type:'string',defaultsTo:'red'},
  		color:{type:'string',defaultsTo:'green'},
  		nbArticles:{type:'int',defaultsTo:0},
        nbProjects:{type:'int',defaultsTo:0},
  		total:{type:'int',defaultsTo:0},
        images:{collection:'image',defaultsTo:[]},
        articles:{collection:'article', via: 'categories'},
        projects:{collection:'project', via: 'categories'},
  		selfUpdate:function(options,cb){
        console.log('SELF UPDATE');
        console.log(options);

        if(options.parentType == 'article')
        {
            if(options.verb == 'add'){

                Category.findOne(this.id).then(function(data){
                console.log(data);
                console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<);");
                    data.nbArticles= Number(data.nbArticles)+1;
                    data.total= Number(data.total)+1;
                    console.log(data);
                    return Category.update(data.id ,
                    {
                        nbArticles : data.nbArticles,
                        total : data.total
                    }).then(function(result){
                        console.log(result[0]);
                        cb(null,result[0]);
                        Category.publishUpdate( data.id , {
                                nbArticles : data.nbArticles,
                                total : data.total
                        } )
                    })
                   
                }).catch(function (err) {
                    cb(err,null);
                });
            }
  
            if(options.verb == 'remove'){

              Category.findOne(this.id).then(function(data){
                    data.nbArticles= Number(data.nbArticles) -1;
                    data.total= Number(data.total) -1;
                    if(data.total<=0){
                     //&& data.nbArticles<=0 && data.nbArticles<=0 &&
                        return Category.destroy(data.id).then(function(result){
                            cb(null,result[0]);
                            Category.publishDestroy( data.id )
                        })  
                    }else{
                        return Category.update(data.id ,
                        {
                            nbArticles : data.nbArticles,
                            total : data.total
                        }).then(function(result){
                            cb(null,result[0]);
                            Category.publishUpdate( data.id , {
                                nbArticles : data.nbArticles,
                                total : data.total
                            } )
                        })

                    }
                   
                }).catch(function (err) {
                    cb(err,null);
                });
            }
        }
        if(options.parentType == 'project')
        {
            if(options.verb == 'add'){

                Category.findOne(this.id).then(function(data){
                console.log(data);
                console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<);");
                    data.nbProjects= Number(data.nbProjects)+1;
                    data.total= Number(data.total)+1;
                    console.log(data);
                    return Category.update(data.id ,
                    {
                        nbProjects : data.nbProjects,
                        total : data.total
                    }).then(function(result){
                        console.log(result[0]);
                        cb(null,result[0]);
                        Category.publishUpdate( data.id , {
                                nbProjects : data.nbProjects,
                                total : data.total
                        } )
                    })
                   
                }).catch(function (err) {
                    cb(err,null);
                });
            }
  
            if(options.verb == 'remove'){

              Category.findOne(this.id).then(function(data){
                    data.nbProjects= Number(data.nbProjects) -1;
                    data.total= Number(data.total) -1;
                    if(data.total<=0){
                     //&& data.nbProjects<=0 && data.nbProjects<=0 &&
                        return Category.destroy(data.id).then(function(result){
                            cb(null,result[0]);
                            Category.publishDestroy( data.id )
                        })  
                    }else{
                        return Category.update(data.id ,
                        {
                            nbProjects : data.nbProjects,
                            total : data.total
                        }).then(function(result){
                            cb(null,result[0]);
                            Category.publishUpdate( data.id , {
                                nbProjects : data.nbProjects,
                                total : data.total
                            } )
                        })

                    }
                   
                }).catch(function (err) {
                    cb(err,null);
                });
            }
        }
      }
	},
	afterCreate: function (value, callback){
      console.log('afterCreate category');

        es.create('category',value).then(function(){
            return callback()
        }).catch(function(err){
               console.log(err);
        })
 
    },
    afterUpdate: function (value, callback){
        console.log('after UPDATE category');

        es.update('category',value).then(function(){
            return callback()
        }).catch(function(err){
               console.log(err);
        })
    },
    afterDestroy: function (value, callback){
        console.log('after destroy category');
        es.delete('category',value[0]).then(function(){
            return callback()
        }).catch(function(err){
               console.log(err);
        })
    },
    beforeDestroy: function (value, callback){
        console.log('BEFORE SLIDE DESTROY');
        console.log(value.where.id);
        var id = value.where.id
        Category.findOne(id).populateAll().then(function(data){
            console.log(data);
            var imgsToDestroy = data.images.map(function(img) {
                return Image.destroy(img.id);
            });
            return Promise.all(imgsToDestroy)
              .then(function() {
                        callback()
            })
            
        })
    }
};
