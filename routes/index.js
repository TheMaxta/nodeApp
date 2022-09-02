const res = require("express/lib/response")

const express = require("express")
const router = express.Router()
const { ensureAuth, ensureGuest } = require("../middleware/auth")
const Post = require("../models/Story.js")
const nodemon = require("nodemon")

// @desc      Login/Landing page
// @route     GET /
//create a route
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login'
    })  
})

// @desc      Dashboard page
// @route     GET /dashboard
//create a route
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const posts = await Post.find({ user: req.user.id }).lean().sort({ createdAt: 'desc' })


        res.render('dashboard', {
            name: req.user.firstName,
            lastName: req.user.lastName,
            posts
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')

    }
})

// @desc      Test page
// @route     GET /test
//create a route
router.get('/myPosts', ensureAuth, async (req, res) => {
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