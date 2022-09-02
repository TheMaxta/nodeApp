const res = require("express/lib/response")

const express = require("express")
const router = express.Router()
const { ensureAuth, ensureGuest } = require("../middleware/auth")
const Post = require("../models/Post.js")
const nodemon = require("nodemon")


router.get('/', ensureAuth, async (req, res) => {
    try {
        const posts = await Post.find({ user: req.user.id }).lean()
        const oldestPost = posts[0]
        const newestPost = posts[posts.length-1]
        let highestPost = posts[0];
        let lowestPost = posts[0];
        let totalNumPosts = posts.length;


        posts.forEach(function (currentPost, index, arr) {
            if (currentPost.score > highestPost.score){ highestPost = currentPost }
        });
        posts.forEach(function (currentPost){
            if (currentPost.score < lowestPost.score){ lowestPost = currentPost }
        });


        res.render('profilePage', {
            layout: 'other',
            name: req.user.firstName,
            lastName: req.user.lastName,
            createdAt: req.user.createdAt,
            image: req.user.image,
            posts,
            oldestPost,
            newestPost,
            highestPost,
            lowestPost,
            totalNumPosts
            
        })    
    } catch (err) {
        console.error(err)
        res.render('error/500')        
    }
})


// @desc      Test page
// @route     GET /test
//create a route
router.get('/test', ensureAuth, async (req, res) => {
    try {
        const posts = await Post.find({ user: req.user.id })
        .populate('user')
        .sort({ createdAt: 'desc' })
        .lean()

        res.render('welcome', {
            layout: 'other',
            name: req.user.firstName,
            lastName: req.user.lastName,
            image: req.user.image,
            posts
        })    
    } catch (err) {
        console.error(err)
        res.render('error/500')        
    }
})





module.exports = router