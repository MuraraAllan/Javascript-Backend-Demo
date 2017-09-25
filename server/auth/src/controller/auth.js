const User = require('../model/mongoose/user');
const { getUserToken, verifyToken } = require('../utils');
const { STATUS_USER_ERROR, STATUS_NOT_FOUND, STATUS_OK, sendUserError, sendStatusOk, checkUserData } = require('./routeConstants');
const userRoutes = require('./user');
const signUp = (req, res) => {
  // create a new user and return a valid JWT token to the client
  if (!checkUserData(req)) {
    sendUserError(res, 'Invalid data');
    return;
  }
  const email = req.body.username;
  const password = req.body.password;
  const user = new User({ email, password });
  user.save((err, user) => {
    if (err) {
      sendUserError(res, err);
      return;
    }
    const token = getUserToken(user); 
    sendStatusOk(res, {token});
    return;
  });
}

const signIn = (req,res) => {
  if (!checkUserData(req)) {
    sendUserError(res, 'Invalid data');
    return;
  }
  const reqUsername = req.body.username;
  const reqPassword = req.body.password;
  // generate a JWT token if the username/password is valid
  // JWT will contain : userID, accessLevel for graphql API resolvers 
  User.findOne({ email : reqUsername }, (err,user) => {
    if (!user) {
      sendUserError(res, 'Invalid Password/Username combination :(');
      return;
    }
    user.comparePassword(reqPassword).then((valid) => {
      if (valid != true) {
        sendUserError(res,'Invalid Password/Username combination :(');
        return;
      }
// distinguish between jwt accesspoint or session
      if (req.path === '/auth/jwt') {
        const token = getUserToken(user); 
        sendStatusOk(res, {token});
        return;
      }
      req.session.userID = user.id;
      sendStatusOk(res, {logged: true}) 
    })
  });
};

const signOut = (req,res) => {
  req.session.destroy((err) => {
    if (err) {
      sendUserError(res, 'You are not logged in');
      return;
    }
    sendStatusOk(res, { loggedOut: true });
    return
  });
};

const restrictedRoutes = (req,res, next) => {
  const token = req.headers['authorization']
  if (token) {
    const decoded = verifyToken(req.headers['authorization']);
    if (decoded === undefined) {
      sendUserError(res, 'Your token is invalid, please login again');
      return
    }
    req.userID = decoded.data.id;
    next();
    return
  }
  if (!req.session.userID) {
    sendUserError(res, 'You need to Authenticate in order to access the API');
    return;
  }
  next();
};

module.exports = (server) => {
  server.post('/user/signup', userRoutes.signUp);
  server.post('/auth/signout', signOut);
  server.post('/auth(/jwt|/session)$/', signIn);
//  server.post('/auth/linkedin/*', LinkedInAuth);
//  server.get('/auth/linkedin/*', LinkedInAuth);
  server.use(restrictedRoutes);
  userRoutes(server);
}
