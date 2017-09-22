const { STATUS_USER_ERROR, STATUS_NOT_FOUND, STATUS_OK, sendUserError, sendStatusOk, checkUserData } = require('./routeConstants');
const User = require('../model/mongoose/user'); 
const { getUserToken, verifyToken, findUserID } = require('../utils');

const me = (req,res) => { 
  const userID = findUserID(req);
  User.findById(userID, (err, user) => { 
    sendStatusOk(res, { user: user.email } ); 
    return
  }); 
};

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
};

const deleteMe = (req, res) => {
  const userID = findUserID(req);
  User.findByIdAndRemove(userID , (err, user) => {
    if (err) {
      sendUserError(err);
      return;
    }
    sendStatusOk(res, { deleted: true } ); 
  }); 
};

const updateUser = (req, res) => {
  const reqUsername = req.body.username;
  const reqPassword = req.body.password;
  // generate a JWT token if the username/password is valid
  // JWT will contain : userID, accessLevel for graphql API resolvers 
  //User.findOne({ email : reqUsername }, (err,user) => {
    
  //});
};

module.exports = (server) => {
  server.get('/user', me);
  server.delete('/user', deleteMe);
  server.put('/user/:email', updateUser);
};
module.exports.signUp = signUp;
