var fs= require('fs');
/**
 * TestController
 *
 * @description :: Server-side logic for managing tests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	


  /**
   * `TestController.toto()`
   */
  // toto: function (req, res) {
  //   console.log('toto');
  //   mail.sendEmail({
  //            from: '"Fred Foo 👥" <foo@blurdybloop.com>', // sender address 
  //            to: 'alexismomcilovic@gmail.com', // list of receivers 
  //            subject: 'Hellos ✔', // Subject line 
  //            text: 'Hello worldsssss', // plaintext body 
  //            html: '<b>Hello world 🐴</b>' // html body 
  //        }).then(function(data){
  //           console.log('THEN IN TOTO');
  //           console.log(data);
  //        });
  // },
   toto: function (req, res) {
    console.log('toto');
    mail.sendEmail({
             from: '"Fred Foo 👥" <foo@blurdybloop.com>', // sender address 
             to: 'alexismomcilovic@gmail.com', // list of receivers 
             subject: 'Hellos ✔', // Subject line 
             text: 'Hello worldsssss', // plaintext body 
             html: '<b>Hello world 🐴</b>' // html body 
         },'newUser',{name:'alexis',firstname:'momcilovic'}).then(function(data){
            console.log('THEN IN TOTO');
            console.log(data);
         });
  },
  peter: function (req, res) {
    console.log('toto');

    for(i=0 ; i<200000; i++){
          mail.sendEmail({
               from: '"Fred Foo 👥" <foo@blurdybloop.com>', // sender address 
               to: 'pierre.momcilovic@supagro.fr', // list of receivers 
               subject: 'La connerie à ses limite #testmoipourvoir', // Subject line 
               text: 'ta de la chance je met pas de photos', // plaintext body 
          }).then(function(data){
              console.log('THEN IN TOTO');
              console.log(data);
          });
    }
  },
  saveDash: function (req, res) {

    console.log('SAVE DASH');
    
    console.log(req.body);

    fs.writeFile('dash.js',JSON.stringify(req.body), function (err) {
      if (err) throw err;

      console.log('It\'s saved!');
      return res.send({reponse: 'saved'});

    });


  },
  restoreDash: function (req, res) {
    
    fs.readFile('dash.js', 'utf8', function (err,data) {
      if (err){
        return res.status(500).send({});
      }

      console.log('We can read File');
      // console.log(data);
      var result = JSON.parse(data);
      console.log(_.isEmpty(result))
      if(_.isEmpty(result))
      { 
        console.log('nodata');
        return res.status(400).send(result);
      }else
      {
        console.log('DATAS SEND');
        return res.send(result);
      }


    });
      // var json = fs.readFileSync('dash.js', 'utf8')

      // console.log('We can read File');
      // console.log(json);

      // return res.send(JSON.parse(json));

  }
}; 

