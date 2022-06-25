const mongoose = require('mongoose')

const StorySchema = new mongoose.Schema({
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
    },
    story:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Story',
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Story', StorySchema)