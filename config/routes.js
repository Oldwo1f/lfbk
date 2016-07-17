/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  // '/': {
  //   view: 'homepage'
  // },
  '/admin':'adminController.serveApp',



 

  
  'GET /api/tag/searchAutocomplete/:searchText':'tagController.searchAutocomplete',
  'GET /api/category/searchAutocomplete/:searchText':'categoryController.searchAutocomplete',
  'POST /api/article/:id/documents':'articleController.uploadDocument',
  'POST /api/article/:id/images':'articleController.uploadImage',
  'POST /api/category/:id/images':'categoryController.uploadImage',
  'GET /image/:size/:name':'ImageController.serveImage',
  'GET /document/:name':'DocumentController.serveDocument',
  'POST /api/image/resize':'ImageController.resizeImage',
  'POST /api/image/resizeprofile':'ImageController.resizeImageProfile',
  'get /api/article/search/:sort/:slug':'articleController.search',
  'get /api/article/:sort/:limit/:page':'articleController.fetch',
  'get /api/articleActif/:sort/:limit/:page':'articleController.fetchActive',
  'get /api/article/:id':'articleController.fetchOne',
  // 'POST /api/mycomment/:id':'commentController.update'


  'POST /api/project/:id/documents':'projectController.uploadDocument',
  'POST /api/project/:id/images':'projectController.uploadImage',
  'get /api/project/search/:sort/:slug':'projectController.search',
  'get /api/project/:sort/:limit/:page':'projectController.fetch',
  'get /api/projectActif/:sort/:limit/:page':'projectController.fetchActive',
  'get /api/project/:id':'projectController.fetchOne',
  //USER
  // 'POST /user':'UserController.create',
  'GET /api/user/verifyUniqueEmail/:email':'UserController.verifyUniqueEmail',
  'POST /user/firstConnexion':'UserController.firstConnexion',
  'get /addFirstAdmin':'UserController.addFirstAdmin',
  'POST /auth/login':'UserController.login',
  'POST /api/user/:id/images':'userController.uploadImage',
  'get /api/user/search/:sort/:slug':'userController.search',
  'GET /api/user/searchAutocomplete/:searchText':'userController.searchAutocomplete',
  'POST /api/user/:id/saveDash':'userController.saveDash',
  
  //admin
  'GET /analytics/:period/:metrics':'adminController.analytics',
  'GET /getBestBlogger':'adminController.getBestBlogger',
  'GET /countAll':'adminController.countAll',
  'GET /getNewComments':'adminController.getNewComments',
  'GET /getNotifications/:page':'adminController.getNotifications',
  'GET /getSocials':'adminController.getSocials',

  //Params 
  'GET /getTraductions/:lang':'ParamsController.getTraductions',
  'PUT /saveTraduction/:lang':'ParamsController.saveTraduction',
  'GET /getUploadsSize':'ParamsController.getUploadsSize',
  'GET /backupFiles':'ParamsController.backupFiles',
  'GET /backupDb':'ParamsController.backupDb',
  'GET /restoreDb':'ParamsController.restoreDb',
  'GET /gitCheckout':'ParamsController.gitCheckout',
  'GET /getVersion':'ParamsController.getVersion',
  'GET /getDbStats':'ParamsController.getDbStats',
  'GET /getLangs':'ParamsController.getLangs',
  'GET /getConfig':'ParamsController.getConfig',
  'GET /restartSite':'ParamsController.restartSite',

  // 'POST /article/:id/tags/:pk':'ArticleController.addTag',
  // 'POST /article/:id/tags':'ArticleController.addTag',
  // 'DELETE /article/:id/tags/:pk':'ArticleController.removeTag',

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/


  //FRONT

    'GET /': 'FrontController.home',
    'GET /home': 'FrontController.home',

  // 'GET /grimpes': 'frontController.portfolio',
  // 'GET /projet/:id/*':'frontController.projet',
  'GET /blog': 'frontController.blog',
  'GET /blog/category/:thiscat': 'frontController.categoryArticle',
  'GET /blog/category/:thiscat/*': 'frontController.categoryArticle',
  'GET /blog/tags/:thiscat/:tagname': 'frontController.tagArticle',
  'GET /blog/article/:id':'frontController.article',
  'GET /blog/article/:id/*':'frontController.article',
  'POST /article/:itemid/addComment':'frontController.addCommentArticle',
  // 'POST /article/addReponse/:itemid/:projid':'frontController.addReponseArticle',
  'GET /infos': 'frontController.infos',
  'GET /grimpes/category/:thiscat': 'frontController.categoryProject',
  'GET /grimpes/tags/:thiscat/:tagname': 'frontController.tagProject',
  'GET /grimpes/project/:id':'frontController.project',
  'GET /grimpes/project/:id/*':'frontController.project',
  'POST /project/:itemid/addComment':'frontController.addCommentProject',
  // 'POST /project/addReponse/:itemid/:projid':'frontController.addReponseProject',
  'GET /contact':'frontController.contact',
  'GET /presta':'frontController.presta',
  
  'POST /contactEmail':'frontController.contactEmail',

  
  // 'POST /project/:itemid/addComment':'frontController.addCommentProj',
  // 'POST /project/addReponse/:itemid/:projid':'frontController.addReponseProj',  
  // 'get /createNotif':'NotificationController.createNotif',
  // 'get /createComment':'NotificationController.createComment',
  // 'GET /file/image/:size/:name':'ImageController.serveImage',
  // 'GET /file/document/:name':'DocumentController.serveDocument',
  // 'GET /test':'FrontController.test',

};
