/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var sid = require('shortid');

module.exports = {
	attributes: {
		role: {type:'string'},
	    civ: {type:'string'},
	    name: {type:'string'},
	    firstname: {type:'string'},
	    email: {type:'string',required:true,unique:true,email:true},
	    phone: {type:'string'},
	    company: {type:'string'},
	    description: {type:'string'},
	    fonction: {type:'string'},
	    usename: {type:'boolean'},
	    password:{type:'string',required:true},
	    changepasswordcomfirm : {type:'string'},
	    newuserhash : {type:'string'},
	    dateMember : {type:'date'},
	    lastActivity : {type:'date'},

  		// dashboard:{type:'json'},
  		theme:{type:'string',defaultsTo:'bg1'},
  		nbArticles:{type:'int',defaultsTo:0},
        nbProjects:{type:'int',defaultsTo:0},
  		total:{type:'int',defaultsTo:0},

	    images:{collection:'image',defaultsTo:[]},
	    selfUpdate:function(options,cb){
	        console.log('SELF UPDATE');
	        console.log(options);

	        if(options.parentType == 'article')
	        {
	            if(options.verb == 'add'){

	                User.findOne(this.id).then(function(data){
	                console.log(data);
	                console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<);");
	                    data.nbArticles= Number(data.nbArticles)+1;
	                    data.total= Number(data.total)+1;
	                    console.log(data);
	                    return User.update(data.id ,
	                    {
	                        nbArticles : data.nbArticles,
	                        total : data.total
	                    }).then(function(result){
	                        console.log(result[0]);
	                        cb(null,result[0]); 
	                        User.publishUpdate( data.id , {
	                                nbArticles : data.nbArticles,
	                                total : data.total
	                        } )
	                    })
	                   
	                }).catch(function (err) {
	                    cb(err,null);
	                });
	            }
	  
	            if(options.verb == 'remove'){

	              User.findOne(this.id).then(function(data){
	                    data.nbArticles= Number(data.nbArticles) -1;
	                    data.total= Number(data.total) -1;
	                    
	                        return User.update(data.id ,
	                        {
	                            nbArticles : data.nbArticles,
	                            total : data.total
	                        }).then(function(result){
	                            User.publishUpdate( data.id , {
	                                nbArticles : data.nbArticles,
	                                total : data.total
	                            } )
	                            cb(null,result[0]);
	                        })

	                   
	                }).catch(function (err) {
	                    cb(err,null);
	                });
	            }
	        }
	        if(options.parentType == 'project')
	        {
	            if(options.verb == 'add'){

	                User.findOne(this.id).then(function(data){
	                console.log(data);
	                console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<);");
	                    data.nbProjects= Number(data.nbProjects)+1;
	                    data.total= Number(data.total)+1;
	                    console.log(data);
	                    return User.update(data.id ,
	                    {
	                        nbProjects : data.nbProjects,
	                        total : data.total
	                    }).then(function(result){
	                        console.log(result[0]);
	                        cb(null,result[0]); 
	                        User.publishUpdate( data.id , {
	                                nbProjects : data.nbProjects,
	                                total : data.total
	                        } )
	                    })
	                   
	                }).catch(function (err) {
	                    cb(err,null);
	                });
	            }
	  
	            if(options.verb == 'remove'){

	              User.findOne(this.id).then(function(data){
	                    data.nbProjects= Number(data.nbProjects) -1;
	                    data.total= Number(data.total) -1;
	                    
	                        return User.update(data.id ,
	                        {
	                            nbProjects : data.nbProjects,
	                            total : data.total
	                        }).then(function(result){
	                            User.publishUpdate( data.id , {
	                                nbProjects : data.nbProjects,
	                                total : data.total
	                            } )
	                            cb(null,result[0]);
	                        })

	                   
	                }).catch(function (err) {
	                    cb(err,null);
	                });
	            }
	        }
	    }
		
	},
	// beforeValidate: function (value, callback){
	//   console.log('afterVALIDATE USER');

	//   	value.password= '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	  	
	//     return callback()
	    

	// },
	// afterValidate: function (value, callback){
	//   console.log('afterVALIDATE USER');

	//   	sid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
	// 	sid.seed(20);
	// 	var myuniquevalue = sid.generate()
	//   	var link = "http://localhost:3000/#/firstconnexion/"+myuniquevalue,

	//   	if(value.password){

	//   	}
	//   	if(value.)
	//   	value.newuserhash = myuniquevalue;
	//   	value.password= 'myuniquevalue';
	//   	mail.sendEmail({
 //             from: '"'+sails.config.company+'" <'+sails.config.mainEmail+'>', // sender address 
 //             to: 'alexismomcilovic@gmail.com', // list of receivers 
 //             subject: sails.config.company+' - Creation de compte', // Subject line 
 //         },'newUser',{link:link}).then(function(data){
 //            console.log('THEN IN TOTO');
 //            console.log(data);
 //         });






	//         return callback()
	    

	// },
	beforeCreate: function (value, callback){
	  console.log('afterVALIDATE USER');
	  console.log(value);
	  	sid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
		sid.seed(20);
		var myuniquevalue = sid.generate()
	  	var link = "http://localhost:3000/admin#/firstconnexion/"+myuniquevalue+"/"+value.email;
	  	value.newuserhash = myuniquevalue;
	  	var encrypted = crypto.encrypt(myuniquevalue);
	  	value.password= encrypted;
	  	mail.sendEmail({
             from: '"'+sails.config.company+'" <'+sails.config.mainEmail+'>', // sender address 
             to: 'alexismomcilovic@gmail.com', // list of receivers 
             subject: sails.config.company+' - Creation de compte', // Subject line 
         },'newUser',{link:link}).then(function(data){
            console.log('THEN IN TOTO');
            console.log(data);
         });
	    return callback()
	    

	},
};

