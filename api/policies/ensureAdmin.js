var jwt = require('jwt-simple');

module.exports = function(req, res, next) {
    console.log('IS ADMIN ?')

  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
  }

  var token = req.headers.authorization.split(' ')[1];
  var payload = jwt.decode(token, sails.config.secret);

  if (payload.exp <= Date.now()) {
    return res.status(401).send({ message: 'Token has expired' });
  }
  console.log(payload.data);
  if(payload.data.role ==='admin' || payload.data.role ==='superadmin' )
  {
      req.user = payload.sub;
      next();
  }
  else{
    res.status(403).send('Vous n\'avez pas les droits')
  }
};
