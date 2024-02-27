const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "User name is Requred field !"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is Requred field !"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Password is Requred field"],
    minLength: 8
  },
  confirmPassword: {
    type: String,
    required: [true, "User name is Requred field"],
    // validate:{
    //     validator: function(val){
    //         return val==this.password
    //     }
    // }
  }
});

UserSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password,12);
    this.confirmPassword = undefined
    next()
})

const UserModel = mongoose.model('usersLoginDashboard',UserSchema)

module.exports = UserModel;