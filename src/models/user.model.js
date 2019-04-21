const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const gravatar = require('gravatar')

const { Schema } = mongoose

let userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    gravatar: String,
    created_at: {
        type: Date,
        default: Date.now
    },
    images: [{
        type: Schema.Types.ObjectId,
        ref: 'image'
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    followings: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }]
})

userSchema.pre('save', function(next) {
    var user = this

    let urlGravatar = gravatar.url(user.email, {s: '100', r: 'x', d: 'retro'}, false)
    user.gravatar = urlGravatar

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next()

    // generate a salt
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err)

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err)

            // override the cleartext password with the hashed one
            user.password = hash
            next()
        })
    })
})

userSchema.methods.validPassword = function(password) {

    return bcrypt.compareSync(password, this.password)

}

module.exports = mongoose.model('user', userSchema)