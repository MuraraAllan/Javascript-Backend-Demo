const jwt = require('jsonwebtoken');
const { appSecret } = require('../secret.js');

const getUserToken = (user) => {
//one day lifetime token 
  return token = jwt.sign({
           exp: Math.floor(Date.now() / 1000) + 86400,
           data: { id: user._id, acessLevel: user.acessLevel }
         }, appSecret);
}

const verifyToken = (token) => {
  return jwt.verify(token, appSecret, (err, decoded) => {
    return decoded
  });
};

const findUserID = req => req.session.userID ? req.session.userID : req.userID

module.exports = {
  getUserToken,
  verifyToken,
  findUserID,
};

