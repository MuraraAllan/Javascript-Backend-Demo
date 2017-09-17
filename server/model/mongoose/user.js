const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;
const bcrypt = require('bcrypt');
const SALT_COST = 12;
mongoose.promise = global.Promise;
//model user will be responsible to return bcrypted password 
const userSchema = new Schema({
  name: {   
    type: String,
  },
  password : {
    type: String,
  },
  email: {
    type: String,
  }
});

userSchema.methods.comparePassword = function (pass) {
  return new Promise((resolve, reject) => {   
    resolve(bcrypt.compare(pass, this.password))
  }).then((res) => res);
};

//implement a pre save hook that convert password into hashed password
userSchema.pre('save', function (next) {
  if (this.password && this.isNew) {
    bcrypt.genSalt(SALT_COST, (err, salt) => {
      if (err) return next(err);
      bcrypt.hash(this.password, salt, (err, newPass) => {
        if (err) return next(err);
        this.password = newPass;
        next();
      });
    })
  }
});

const User = model.call(mongoose,'User',  userSchema);

module.exports = User;
