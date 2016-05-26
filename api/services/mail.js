var config = require('../../config/config');
var Promise = require("bluebird");
var nodemailer = require('nodemailer');

module.exports ={

   mainEmail: config.mainEmail,
   mainEmailPassword: config.mainEmailPassword,
   sendEmail:function(options,template,data,callback){
    var that = this;
        return new Promise(function(resolve,reject){
            

            if(template!= null)
            {
                that.fetchTemplate(template,data).then(function (templateHTML){
                console.log('THEN');
                options.html = templateHTML;

                    return that.send(options).then(function(result) {
                         resolve(result);
                    });
                });

            }else{

                return that.send(options).then(function(result) {
                     resolve(result);
                });
            }



        })
        // if(template!= null)
        // {
        //     this.fetchTemplate(template,data).then(function (templateHTML){
        //         console.log('THEN');
        //         options.html = templateHTML;
        //     });

        // }else{

        //     return this.send(options).then(function(result) {
        //          return result;
        //     });
        // }
      
   },
   send:function(options){
      var transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
              user: this.mainEmail,
              pass: this.mainEmailPassword
          }
      });
      return new Promise(function(resolve,reject){
         transporter.sendMail(options, function(error, info){
            if(error){
               reject(error)
            }else{
               resolve(info) 
            }
         });
      }) 
   },
   fetchTemplate:function(template,data){
    console.log('FETCH');
      return new Promise(function(resolve,reject){
         sails.renderView('email/'+template, {data:data,layout:'emailLayout'}, function(error, html) {

          console.log(html);
            if(error){
               reject(error);
            }else{
               resolve(html);
            }
         });
      })
   }
};

