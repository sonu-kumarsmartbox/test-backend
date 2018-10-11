let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let uniqueValidator = require('mongoose-unique-validator');
let crypto = require('crypto');
let jsonwebtoken = require('jsonwebtoken');
let secret = require('../config').secret;

/* Defining User schema  */

let UserSchema = new Schema({
    firstname:{
        type: String, 
        required:[true, 'is required']
    },
    lastname:{
        type: String, 
        required:[true, 'is required']
    },
    email_activate:{
        type: String, 
    },
    is_verify:{
        type:Boolean,
        default:false
    },
    email: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
    hash: String,
    salt: String, 
    products:[{type:Schema.Types.ObjectId,ref:'Product'}]   
    

});

UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});


UserSchema.methods.validPassword = function(password) {
    let hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};
  
UserSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

/* this method will return a JWT Token */
UserSchema.methods.generateJWT = function() {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    return jsonwebtoken.sign({
        id:this._id,
        username:this.email,
        exp : parseInt(exp.getTime() / 1000),
    }, secret);
};

UserSchema.methods.toAuthJSON = function() {
    return {
        firstname:this.firstname,
        lastname:this.lastname,
        email:this.email,
        token:this.generateJWT(),
    };
};

UserSchema.methods.addmyProducts = function(products) {
    products.forEach(element => {
        this.products.push(element);
    });
    return this.save();
};

module.exports = mongoose.model('User',UserSchema);