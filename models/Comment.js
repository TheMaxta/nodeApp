const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    score:{
        type: Int,
        default: 0
    },
    body:{
        type: String,
        required: true,
        trim: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    Story},
    Post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Comment', CommentSchema)