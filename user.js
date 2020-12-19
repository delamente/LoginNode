const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRount = 10;

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

UserSchema.pre('save', function(next){
    if(this.isNew || this.isModified('password')){
        const document = this;

     bcrypt.hash(document.password, saltRount, (err, hashedPassword) => {
        next(err);
     }else{
            document.password = hashedPassword;
            next();
     }
     });   
        
    }else{
        next();
    }
});

UserSchema.method.isCorrectPassword = function (password, callback){
    bcrypt.compare(password, this.password, function(err, same){
        if(err){
            callback(err);
        }else{
            callback(err, same);
        }
    });
}

module.exports = mongoose.model('User', UserSchema);