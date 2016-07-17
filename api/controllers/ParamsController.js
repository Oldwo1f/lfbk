var moment = require('moment');
var git  = require ('gift');
var MongoClient = require('mongodb').MongoClient
// var fs = require('fs');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require("fs"));
var archiver = require('archiver');
var mds = require('mongo-dump-stream');
var spawn = require('child_process').spawn;
moment.locale('fr', {
    months : "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),
    monthsShort : "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
    weekdays : "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
    weekdaysShort : "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
    weekdaysMin : "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
    longDateFormat : {
        LT : "HH:mm",
        LTS : "HH:mm:ss",
        L : "DD/MM/YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY LT",
        LLLL : "dddd D MMMM YYYY LT"
    },
    calendar : {
        sameDay: "[Aujourd'hui à] LT",
        nextDay: '[Demain à] LT',
        nextWeek: 'dddd [à] LT',
        lastDay: '[Hier à] LT',
        lastWeek: 'dddd [dernier à] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : "dans %s",
        past : "il y a %s",
        s : "quelques secondes",
        m : "une minute",
        mm : "%d minutes",
        h : "une heure",
        hh : "%d heures",
        d : "un jour",
        dd : "%d jours",
        M : "un mois",
        MM : "%d mois",
        y : "une année",
        yy : "%d années"
    },
    ordinalParse : /\d{1,2}(er|ème)/,
    ordinal : function (number) {
        return number + (number === 1 ? 'er' : 'ème');
    },
    meridiemParse: /PD|MD/,
    isPM: function (input) {
        return input.charAt(0) === 'M';
    },
    // in case the meridiem units are not separated around 12, then implement
    // this function (look at locale/id.js for an example)
    // meridiemHour : function (hour, meridiem) {
    //     return /* 0-23 hour, given meridiem token and hour 1-12 */
    // },
    meridiem : function (hours, minutes, isLower) {
        return hours < 12 ? 'PD' : 'MD';
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

module.exports={
	backupDb:function(req,res) {

		console.log('backupDB');
		// console.log( moment().format('dd/mm/yyy') );
		var out = fs.createWriteStream('.tmp/tmp.db');
			out.on('finish', function() {
			  	var rs = fs.createReadStream('.tmp/tmp.db')
		  		var stat = fs.statSync('.tmp/tmp.db');
				res.setHeader('Content-disposition', 'attachment; filename=' + 'bdd-'+sails.config.companyString+'-'+ moment().format('YYYY-MM-DD')+'.db');
				// res.setHeader('Content-length', stat.size);
		  		rs.pipe(res)

		  		try{
			            fs.unlink(".tmp/tmp.db")
			        }catch(e){


			        }
			});
		return mds.dump('mongodb://localhost:27017/'+sails.config.dbname, out, function(err) {
			out.end();
		});
	},
	restoreDb:function(req,res) {

		console.log('restoreDB'); 
		var backup = fs.createReadStream('test/bdd-ARBATOU-4 mai 2015.db');
		// var fs = require('fs');
		// var out = fs.createReadWriteStream('test/mydb.db');
		return mds.load('mongodb://localhost:27017/madmin', backup, function(err,d) {
		  if (!err) { // Everything was sent 
		  } 
		  res.send('ok')
		});
		// res.pipe(out);
    // When the file is done streaming, finish the Javascript string
	    
	},
	restartSite:function(req,res) {

		console.log('restartSite');
		// console.log(sails.config.PATH_TO_WEBSITE);
		var deploySh = spawn('sh', [ 'deploy.sh' ], {
		  cwd:'',
		}); 
		res.send('Votre site est entrain de redemarer. Recharger la page d\ici une quelques de secondes')
		// });
		// res.pipe(out);
    // When the file is done streaming, finish the Javascript string
	    
	},
	getTraductions:function(req,res) {


		// console.log(sails.config.i18n.locales);
		// console.log(req.params.lang);
		console.log('config/locales/'+req.params.lang+'.json');
		// console.log(sails.config.i18n);

		// var file = fs.readFileSync('config/locales/'+req.params.lang+'.json')
		var obj = JSON.parse(fs.readFileSync('config/locales/'+req.params.lang+'.json', 'utf8'));
		// console.log(obj);
		// console.log('---');

		res.send(obj)
	},
	saveTraduction:function(req,res) {


		// console.log(sails.config.i18n.locales);
		console.log('save');
		console.log(req.params.lang);
		// console.log(req.body);
		var json = JSON.stringify(req.body,null, 2)
		console.log(json);
		// console.log('/config/locales/'+req.params.lang+'.json');
		// // console.log(sails.config.i18n);

		// var file = fs.writeFileSync('config/locales/'+req.params.lang+'.json',json)
		fs.writeFile('config/locales/'+req.params.lang+'.json', json, function (err) {
		  if (err){
			res.status(400).send('error')

		  	throw err
		  }
		  console.log('It\'s saved!');
		  res.status(200).send('saved')
		});
		
	},
	getUploadsSize:function(req,res) {

		console.log('hehhehehe');
		var totalFile=0;
		var totalImage=0;
		var totalOriginal=0;
		var totalThumbs=0;
		return Promise.bind({})
			.then(function() { 
				return fs.readdirAsync('uploads/files').map(function(filename) {
					// console.log('hehhehehe:',filename);

						return fs.statAsync('uploads/files/'+filename).then(function(stats) {
							if (stats.isFile()) { totalFile += stats.size; }
						})
				})
			}).then(function() {

				return fs.readdirAsync('uploads/images/originalSize').map(function(filename) {
					// console.log('hehhehehe:',filename);

						return fs.statAsync('uploads/images/originalSize/'+filename).then(function(stats) {
							if (stats.isFile()) { totalImage += stats.size; }
						})
				})
			}).then(function() {

				return fs.readdirAsync('uploads/images/adminThumbs').map(function(filename) {
					// console.log('hehhehehe:',filename);

						return fs.statAsync('uploads/images/adminThumbs/'+filename).then(function(stats) {
							if (stats.isFile()) { totalImage += stats.size; }
						})
				})
			}).then(function() {

				return fs.readdirAsync('uploads/images/profile').map(function(filename) {
					// console.log('hehhehehe:',filename);

						return fs.statAsync('uploads/images/profile/'+filename).then(function(stats) {
							if (stats.isFile()) { totalImage += stats.size; }
						})
				})
			}).then(function() {

				return fs.readdirAsync('uploads/images/resized2').map(function(filename) {
					// console.log('hehhehehe:',filename);

						return fs.statAsync('uploads/images/resized2/'+filename).then(function(stats) {
							if (stats.isFile()) { totalImage += stats.size; }
						})
				})
			}).then(function() {

				return fs.readdirAsync('uploads/images/resized').map(function(filename) {
					// console.log('hehhehehe:',filename);

						return fs.statAsync('uploads/images/resized/'+filename).then(function(stats) {
							if (stats.isFile()) { totalImage += stats.size; }
						})
				})
			}).then(function() {
				// totalImage = totalOriginal
				totalFile = totalFile 
				res.send({'totalImage':totalImage,'totalFile':totalFile})
			})
		
		
	},
	backupFiles:function(req,res) {
		console.log('BACKUP');
		var archive = archiver('zip');

		// var output = fs.createWriteStream('target.zip');

		// output.on('close', function () {
		//     console.log(archive.pointer() + ' total bytes');
		//     console.log('archiver has been finalized and the output file descriptor has closed.');
		// 	res.send(output)

		// });
		res.setHeader('Content-disposition', 'attachment; filename=' + 'Files-'+sails.config.companyString+'-'+ moment().format('YYYY-MM-DD')+'.zip');
		archive.on('error', function(err){
		    throw err;
		});

		archive.pipe(res)
		archive.bulk([
		    { expand: true, cwd: 'uploads', src: ['**/*']}
		]);
		archive.finalize();
		
		// output.pipe(res)
		// var readStream = fs.createReadStream(filePath);
		    // We replaced all the event handlers with a simple call to readStream.pipe()
		    // readStream.pipe(res);

	},
	gitCheckout:function(req,res) {
		console.log('git');
		console.log( 'ffffffff');

		var repo = git("")
		console.log(repo);
		repo.checkout(function (err,argument) {
			console.log('err',err);
			console.log(argument);
			console.log('-----------------');
		})
	},
	getVersion:function(req,res) {
		console.log('version ');
		// console.log(sails.config.PATH_TO_WEBSITE);
		json = JSON.parse(fs.readFileSync('package.json', 'utf8'))
		version = json.version
		// sitejson = JSON.parse(fs.readFileSync(sails.config.PATH_TO_WEBSITE+'package.json', 'utf8'))
		// siteversion = sitejson.version
		res.send({version:version})
	},
	getDbStats:function(req,res) {
		console.log('here');
		var url = 'mongodb://localhost:27017/'+sails.config.dbname;
		// Use connect method to connect to the Server
		MongoClient.connect(url, function(err, db) {
		  console.log("Connected correctly to server");
		  db.stats(function(err, stats) {

		  	console.log('err stats',err);
			res.send(stats)		
		    db.close();
		  })
		});
	},	
	getLangs:function(req,res) {
		console.log('getLangs');
		console.log(sails.config.localesfull);
		console.log(sails.config.defaultLocale);
			res.send({defaults: sails.config.defaultLocale,locales:sails.config.localesfull})		
		 
	},		
	getConfig:function(req,res) {
		
		console.log(sails.config.sizequota);
			res.send({quota: sails.config.sizequota,url:sails.config.URL_HOME,name:sails.config.COMPANY_NAME})		
		 
	},
}
