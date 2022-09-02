const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true,
        trim: true
    },
    status:{
        type: String,
        default: 'public',
        enum: ['public', 'private']
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    comments: [mongoose.Schema.Types.ObjectId],
    
    score:{
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('Post', PostSchema)