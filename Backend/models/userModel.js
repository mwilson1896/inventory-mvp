const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')


const userSchema = mongoose.Schema({
    name: {type: 'string', required: [true, "Please add a name"]}, 
    email: {type: 'string', 
        required: [true, "Please add a email"], 
        unique: true, 
        trim: true, 
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please add a valid email"]
    },
    password: {type: 'string', required: [true, "Please add a password"], 
        minlength: [6, "Password no less than 6 characters"], 
    },

}, {timestamps: true});

// Encrypt password 
userSchema.pre('save', async function(next) {
    if(this.isModified("password")) {
        return next();
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
})

const User = mongoose.model('User', userSchema)

module.exports = User;