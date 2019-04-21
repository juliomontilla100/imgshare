const mongoose = require('mongoose')
const { Schema } = mongoose

let imageSchema = new Schema({
    title: String,
    description: String,
    filename: String,
    url: String,
    cloud_id: String,
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'like'
    }],
    created_at: {
        type: Date,
        default: Date.now
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comment'
    }]
})

module.exports = mongoose.model('image', imageSchema)