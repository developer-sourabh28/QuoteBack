const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    name:{
        type : String,
        required : true,
    },
    email:{
        type : String,
        required : true,
        lowercase: true,
    },
    password : {
        type : String,
        required : true,
    },
})

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(this.password, salt);
    // console.log("Hashed Password:", hashedPassword); // Log the hashed password to verify
    // this.password = hashedPassword;
    next();
    } catch (error) {
        return next(error);
    }
});


const User = mongoose.model('user', UserSchema);
module.exports = User;