/**
 * Tag.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
module.exports = {
  	schema: true,
  	attributes: {
  		text:{type:'string',required:true},
  		nbDocuments:{type:'int',defaultsTo:0},
  		nbArticles:{type:'int',defaultsTo:0},
        nbProjects:{type:'int',defaultsTo:0},
  		total:{type:'int',defaultsTo:0},
        articles:{collection:'article', via: 'tags'},
        projects:{collection:'project', via: 'tags'},
        selfUpdate:function(options,cb){
        console.log('SELF UPDATE TAG');
        console.log(options);

        if(options.parentType == 'article')
        {
            if(options.verb == 'add'){

                Tag.findOne(this.id).then(function(data){
                console.log(data);
                console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<);");
                    data.nbArticles= Number(data.nbArticles)+1;
                    data.total= Number(data.total)+1;
                    console.log(data);
                    return Tag.update(data.id ,
                    {
                        nbArticles : data.nbArticles,
                        total : data.total
                    }).then(function(result){

                        Tag.publishUpdate( data.id , {
                                nbArticles : data.nbArticles,
                                total : data.total
                        } )
                        console.log('--------------');
                        console.log(result[0]);
                        cb(null,result[0]);
                        
                    })
                   
                }).catch(function (err) {
                    cb(err,null);
                });
            }
        
            if(options.verb == 'remove'){

              Tag.findOne(this.id).then(function(data){
                    data.nbArticles= Number(data.nbArticles) -1;
                    data.total= Number(data.total) -1;
                    if(data.total<=0){
                     //&& data.nbArticles<=0 && data.nbArticles<=0 &&
                        return Tag.destroy(data.id).then(function(result){
                            cb(null,result[0]);
                            Tag.publishDestroy( data.id )
                        })
                    }else{
                        return Tag.update(data.id ,
                        {
                            nbArticles : data.nbArticles,
                            total : data.total
                        }).then(function(result){
                            Tag.publishUpdate( data.id , {
                                nbArticles : data.nbArticles,
                                total : data.total
                            } )
                            cb(null,result);
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

                Tag.findOne(this.id).then(function(data){
                console.log(data);
                console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<);");
                    data.nbProjects= Number(data.nbProjects)+1;
                    data.total= Number(data.total)+1;
                    console.log(data);
                    return Tag.update(data.id ,
                    {
                        nbProjects : data.nbProjects,
                        total : data.total
                    }).then(function(result){

                        Tag.publishUpdate( data.id , {
                                nbProjects : data.nbProjects,
                                total : data.total
                        } )
                        console.log('--------------');
                        console.log(result[0]);
                        cb(null,result[0]);
                        
                    })
                   
                }).catch(function (err) {
                    cb(err,null);
                });
            }
        
            if(options.verb == 'remove'){

              Tag.findOne(this.id).then(function(data){
                    data.nbProjects= Number(data.nbProjects) -1;
                    data.total= Number(data.total) -1;
                    if(data.total<=0){
                     //&& data.nbProjects<=0 && data.nbProjects<=0 &&
                        return Tag.destroy(data.id).then(function(result){
                            cb(null,result[0]);
                            Tag.publishDestroy( data.id )
                        })
                    }else{
                        return Tag.update(data.id ,
                        {
                            nbProjects : data.nbProjects,
                            total : data.total
                        }).then(function(result){
                            Tag.publishUpdate( data.id , {
                                nbProjects : data.nbProjects,
                                total : data.total
                            } )
                            cb(null,result);
                        })

                    }
                   
                }).catch(function (err) {
                    cb(err,null);
                });
            }
        }




        // cb();
      }
	},
    afterCreate: function (value, callback){
      console.log('afterCreate TAG');

        es.create('tag',value).then(function(){
            return callback()
        }).catch(function(err){
               console.log(err);
        })
 
    },
    afterUpdate: function (value, callback){
        console.log('after UPDATE TAG');

        es.update('tag',value).then(function(){
            return callback()
        }).catch(function(err){
               console.log(err);
        })
    },
    afterDestroy: function (value, callback){
        console.log('after destroy TAG');
        console.log(value);
        es.delete('tag',value[0]).then(function(){
            return callback()
        }).catch(function(err){
               console.log(err);
        })
    },
};


