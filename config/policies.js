/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions (`true` allows public     *
  * access)                                                                  *
  *                                                                          *
  ***************************************************************************/

  '*': 'ensureAdmin',

  /***************************************************************************
  *                                                                          *
  * Here's an example of mapping some policies to run before a controller    *
  * and its actions                                                          *
  *                                                                          *
  ***************************************************************************/

    adminController:{
      'serveApp':true,
    },
    tagController:{
      'searchAutocomplete':true,
    },
    categoryController:{
      'searchAutocomplete':true,
    },
    ImageController:{
      'serveImage':true,
    },
    DocumentController:{
      'serveDocument':true,
    },
    slideshowController:{
      'fetch':true,
    },
    ParamsController:{
      'getLangs':true,
    },
    articleController:{
      'search':true,
      'fetch':true,
      'fetchActive':true,
      'fetchOne':true,
    },
    projectController:{
      'search':true,
      'fetch':true,
      'fetchActive':true,
      'fetchOne':true,
    },
    UserController:{
      'findOne':true,
      'verifyUniqueEmail':true,
      'firstConnexion':true,
      'addFirstAdmin':true,
      'login':true,
    },
    FrontController:{
      '*':true,
    },





};
