const jwt = require('jsonwebtoken');
const secret = require('../secret.js');
const getUserToken = (user) => {
//one day lifetime token 
  return token = jwt.sign({
           exp: Math.floor(Date.now() / 1000) + 86400,
           data: { id: user._id, acessLevel: user.acessLevel }
         }, secret);
}
module.exports = {
  getUserToken
};

