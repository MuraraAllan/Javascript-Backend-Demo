const STATUS_USER_ERROR = 422;
const STATUS_NOT_FOUND = 400;
const STATUS_OK = 200;
const User = require('../model/mongoose/user');
const { getUserToken } = require('../utils');

let type = 'jwt';
const sendUserError = (res, msg = 'something goes wrong, please contact support@nothing.com :)' ) => {
  res.status(STATUS_USER_ERROR);
  res.json({error: msg});
  return;
} 

const sendStatusOk = (res ,msg = {ok: true}) => {
  res.status(STATUS_OK);
  res.json(msg);
  return;
} 
const checkUserData = (req) => {
  if (!req.body.username || !req.body.password) {
    console.log(req.body.username);
    console.log(req.body.password);
    return false;
  }
  return true;
};

const sendNotFound = (res, msg) => {

}
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
    console.log('error',err);
    if (err) {
      sendUserError(res, err);
      return;
    }
    console.log('created', user);
    const token = getUserToken(user); 
    console.log('token',token);
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
      if (req.path === '/signin-jwt') {
        const token = getUserToken(user); 
        sendStatusOk(res, {token});
        return;
      }
      req.session.userID = user.id;
      sendStatusOk(res, {logged: true}) 
    })
  });
};

const test =  (req,res) => {
  if (req.session.userID) {
    User.findById(req.session.userID, (err,user) => {
      sendStatusOk(res, { user: user.email } );
    });
    return;
  }
  res.status(404);
  res.send('Sorry, we cannot find that!');
  return;
}

module.exports = (server) => {
  server.get('/me', test);
  server.post('/signup', signUp);
  server.post('/signin-(jwt|session)$/', signIn);
}
