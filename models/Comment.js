const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    score:{
        type: Number,
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
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    }, 
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Comment', CommentSchema)