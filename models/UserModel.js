let mongoose = require('mongoose');
// let bcrypt = require('bcrypt');
// let SALT_WORK_FACTOR = 10;

let UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cpf: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  online: {
    type: Boolean,
    default: 0,
  }
});

// UserSchema.pre('save', function(next) {
//   var use = this;

//   if(!UserSchema.isModified('password')) return next();

//   bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
//     if(err) return next(err);

//     bcrypt.hash(user.password, salt, function(err, hash) {
//       if(err) return next(err);
//       user.password = hash
//       next();
//     });
//   });
// });

// UserSchema.methods.comparePassword = function(userPassword, cb) {
//   bcrypt.compare(userPassword, this.password, function(err, isMatch) {
//     if(err) return cb(err);
//     cb(null, isMatch);
//   })
// }

module.exports = mongoose.model('User', UserSchema);
