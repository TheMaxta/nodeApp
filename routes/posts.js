const res = require("express/lib/response")

const express = require("express")
const router = express.Router()
const { ensureAuth } = require("../middleware/auth")
const Post = require("../models/Post.js")
const Comment = require('../models/Comment.js')
const nodemon = require("nodemon")


// @desc      Show Add page
// @route     GET /posts/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('posts/add_post', {
    })
})

// @desc      Show Categories page
// @route     GET /posts/categories
router.get('/categories', ensureAuth, async (req, res) => {

    const posts = await Post.find({ status: 'public' })

    var categories = new Array();
    
    //goal: determine which categories are active and should be output, then output an array with category names 
    //then: determine number of posts for each category
    //then: determine active users for each category

    posts.forEach(function (currentPost, index, arr){
        categories.push(currentPost.category)
    })

    //hash
    //var categoryNums = {};
    var categoryNums = {};

    categories.forEach(function(i){ categoryNums[i] =  (categoryNums[i]||0) + 1;});
    


    //this removes duplicates by category. We just want one of each active category
    var uniqueChars = [...new Set(categories)];

    categories = new Array(uniqueChars);
    
    console.log(typeof categoryNums);          
    res.render('posts/categories', {
        layout: 'other',
        posts,
        categories,
        categoryNums

    })     
})


// @desc      Show Add page
// @route     GET /posts/add
router.get('/comment/:postId', ensureAuth, async (req, res) => {

    const post = await Post.findById( { _id: req.params.postId} ).lean()

    res.render('posts/add_comment', {
        post,
    })
})

// @desc       Process add Comment Form
// @route       GET /posts/:id/comment      | id is the single post's id
router.post('/add_comment/:postId', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        const post = await Post.findById( { _id: req.params.postId})
        //console.log(post.comments[0].body);
        //Create a new comment
        const comment = new Comment(req.body);

        await comment.save()
        
        await  post.comments.unshift(comment);

        await  post.save();

        //res.send(comment);
        //redirect
        res.redirect('/')

    } catch(err) {
        console.error(err)
        res.render('error/500')
    }
})

// @desc      Process add Form
// @route     POST /posts
router.post('/', ensureAuth, async (req, res) => {
    try {
        //check body from forum's user with current user session
        req.body.user = req.user.id
        //create new post with req.body that forum page sent
        await Post.create(req.body)
        res.redirect('/myPosts')
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
     
})

// @desc      Show All Posts 
// @route     GET /posts/
router.get('/t/', ensureAuth, async (req, res) => {
    try {
        const posts = await Post.find({ status: 'public' })

            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()

            res.render('oldViews/index', {
                posts
            })
    } catch (err) {
        console.error(err)
        res.render('/error/500')
    }   
})
// @desc      Template : Show All Posts : Template
// @route     GET /posts/
router.get('/', ensureAuth, async (req, res) => {
    try {
        const posts = await Post.find({ status: 'public' })

            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()

            res.render('posts/publicPosts', {
                layout: 'other',
                posts
            })
    } catch (err) {
        console.error(err)
        res.render('/error/500')
    }   
})

// @desc      Show Posts by Category *NEW*
// @route     GET /posts/
router.get('/category/:selectedCategory', ensureAuth, async (req, res) => {
    try {
        const posts = await Post.find({ category: req.params.selectedCategory })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()

            var category = posts[0].category;

            res.render('posts/publicPosts', {
                layout: 'other',
                posts,
                category
            })
    } catch (err) {
        console.error(err)
        res.render('/error/500')
    }   
})

// @desc      Show TOP posts by Category 
// @route     GET /posts/
router.get('/top/:selectedCategory', ensureAuth, async (req, res) => {
    try {
        const posts = await Post.find({ category: req.params.selectedCategory })
            .populate('user')
            .sort({ score: 'desc' })
            .lean()

            var category = posts[0].category;

            res.render('posts/publicPosts', {
                layout: 'other',
                posts,
                category
            })
    } catch (err) {
        console.error(err)
        res.render('/error/500')
    }   
})


// @desc      Show Single Post
// @route     GET /posts/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {        
        const post = await Post.findById( { _id: req.params.id})
        .populate('user')
        .lean()

        if (!post){
            res.render('/error/404')
        } else {
            res.render('oldViews/view', {
                post,
            })
        }
    } catch (err) {
        console.error(err)
        res.render('error/404')
    }
})

// @desc      new single post page
// @route     GET /posts/template/:id
router.get('/temp/:id', ensureAuth, async (req, res) => {
    try {        
        const post = await Post.findById( { _id: req.params.id})
        .lean()
        .populate('user')
        .populate('comments')
        .populate('comments.user')
        const comments = post.comments

        if (!post){
            res.render('/error/404')
        } else {
            res.render('posts/singlePost', {
                layout: 'other',
                post,
                comments,
            })
        }
    } catch (err) {
        console.error(err)
        res.render('error/404')
    }
})

// @desc      Show Users Posts/y
// @route     GET /posts/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
        const posts = await Post.find({ 
            user: req.params.userId,
            status: 'public'
        })

            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()

            res.render('oldViews/index', {
                posts
            })
    } catch (err) {
        console.error(err)
        res.render('/error/500')
    }
})

// @desc      Edit Posts
// @route     GET /posts/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    const post = await Post.findOne({
        _id: req.params.id
    }).lean()

    if (!post){
        res.render('/error/404')
    }
    if(post.user != req.user.id){
        res.redirect('/posts')
    } else {
        res.render('posts/edit', {
            post,
        })
    }
})

// @desc      Update post
// @route     PUT /posts/:id
router.put('/:id', ensureAuth, async (req, res) => {
    try {
        let post = await Post.findById(req.params.id).lean()

    if (!post){
        return res.render('error/404')
    }
    if(post.user != req.user.id){
        res.redirect('/posts')
    } else {
        post = await Post.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new:  true,
            runValidators: true,
        }).lean()

        post = await Post.findById(req.params.id)
        .lean()
        .populate('user')

        res.render('posts/singlePost', {
            layout: 'other',
            post
        })
    }
    } catch (err) {
        console.error(err)
        return res.render('error/500')        
    }
})
// @desc      Upvote Post
// @route     PUT /posts/upvote/:id
router.put('/upvote/:id', ensureAuth, async (req, res) => {

    let post = await Post.findById(req.params.id).lean()
    let n = post.score += 1
    console.log("Score"+post.score)

    post = await Post.findOneAndUpdate({ _id: req.params.id}, { score: n }, {
        new: true,
        runValidators: true,
    })
    res.redirect('/myPosts')
})
// @desc      Downvote Post
// @route     PUT /posts/downvote/:id
router.put('/downvote/:id', ensureAuth, async (req, res) => {

    let post = await Post.findById(req.params.id).lean()
    let n = post.score -= 1
    console.log("Score"+post.score)

    post = await Post.findOneAndUpdate({ _id: req.params.id}, { score: n }, {
        new: true,
        runValidators: true,
    })
    res.redirect('/myPosts')
})

// @desc      Delete post
// @route     DELETE /posts/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        await Post.remove({ _id: req.params.id })
        res.redirect('/myPosts')
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    } 
})


module.exports = router  