const mongoose = require('mongoose')
const { Schema } = mongoose

let likeSchema = new Schema({
    like: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    image: {
        type: Schema.Types.ObjectId,
        ref: 'image'
    },
})

module.exports = mongoose.model('like', likeSchema)