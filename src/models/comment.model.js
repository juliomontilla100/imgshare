const mongoose = require('mongoose')
const { Schema } = mongoose

let commentSchema = new Schema({
    comment: String,
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

module.exports = mongoose.model('comment', commentSchema)