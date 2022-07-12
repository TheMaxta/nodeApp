const res = require("express/lib/response")

const express = require("express")
const router = express.Router()
const { ensureAuth } = require("../middleware/auth")
const Story = require("../models/Story.js")
const nodemon = require("nodemon")


// @desc      Show Add page
// @route     GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add', {
    })
     
})
// @desc        Show add comment page
// @route       GET /stories/:id/comment      | id is the single post's id
router.get('/comment'), ensureAuth, (req, res) => {
    res.render('stories/add_comment')
}

// @desc       Process add Comment Form
// @route       GET /stories/:id/comment      | id is the single post's id
router.post('/:id/comment'), ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        const story = await Story.findById( { _id: req.params.id})
        req.body.story = story
        await Comment.create(req.body)
        res.redirect('/dashboard')

    } catch (err) {
        console.err(err)
        res.render('error/500')
    }
}



// @desc      Process add Form
// @route     POST /stories
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        res.render('/error/500')
    }
     
})


// @desc      Show All Stories 
// @route     GET /stories/
router.get('/', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ status: 'public' })

            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()

            res.render('stories/index', {
                stories
            })
    } catch (err) {
        console.error(err)
        res.render('/error/500')
    }
     
})
// @desc      Template : Show All Stories : Template
// @route     GET /stories/
router.get('/t/', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ status: 'public' })

            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()

            res.render('stories/publicIndex', {
                layout: 'other',
                stories
            })
    } catch (err) {
        console.error(err)
        res.render('/error/500')
    }
     
})
// @desc      Show Single Story
// @route     GET /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {        
        const story = await Story.findById( { _id: req.params.id})
        .populate('user')
        .lean()

        if (!story){
            res.render('/error/404')
        } else {
            res.render('stories/view', {
                story,
            })
        }
    } catch (err) {
        console.error(err)
        res.render('error/404')
    }
})

// @desc      Testing new single story page
// @route     GET /stories/template/:id
router.get('/temp/:id', ensureAuth, async (req, res) => {
    try {        
        const story = await Story.findById( { _id: req.params.id})
        .populate('user')
        .lean()

        if (!story){
            res.render('/error/404')
        } else {
            res.render('stories/singlePost', {
                layout: 'other',
                story,
            })
        }
    } catch (err) {
        console.error(err)
        res.render('error/404')
    }
})


// @desc      Show Users Stories/y
// @route     GET /stories/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ 
            user: req.params.userId,
            status: 'public'
        })

            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()

            res.render('stories/index', {
                stories
            })
    } catch (err) {
        console.error(err)
        res.render('/error/500')
    }
     
})


// @desc      Edit Stories
// @route     GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    const story = await Story.findOne({
        _id: req.params.id
    }).lean()

    if (!story){
        res.render('/error/404')
    }
    if(story.user != req.user.id){
        res.redirect('/stories')
    } else {
        res.render('stories/edit', {
            story,
        })
    }
})

// @desc      
// @router    GET /stories/upvote/:id
router.get('/upvote', ensureAuth, async (req, res) => {
    const story = await Story.findOne({
        _id: req.params.id
    }).lean()

    if (!story){
        res.render('/error/404')
    }
    if(story.user != req.user.id){
        res.redirect('/stories')
    } else {
        res.redirect('/stories/upvote/:id')
    }
})
// @desc      Update story
// @route     PUT /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id).lean()

    if (!story){
        return res.render('error/404')
    }
    if(story.user != req.user.id){
        res.redirect('/stories')
    } else {
        story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new:  true,
            runValidators: true,
        })

        res.redirect('/dashboard')

    }
    } catch (err) {
        console.error(err)
        return res.render('error/500')        
    }
})
// @desc      Upvote Story
// @route     PUT /stories/upvote/:id
router.put('/upvote/:id', ensureAuth, async (req, res) => {

    let story = await Story.findById(req.params.id).lean()
    let n = story.score += 1
    console.log("Score"+story.score)

    story = await Story.findOneAndUpdate({ _id: req.params.id}, { score: n }, {
        new: true,
        runValidators: true,
    })
    res.redirect('/test')

})
// @desc      Downvote Story
// @route     PUT /stories/downvote/:id
router.put('/downvote/:id', ensureAuth, async (req, res) => {

    let story = await Story.findById(req.params.id).lean()
    let n = story.score -= 1
    console.log("Score"+story.score)

    story = await Story.findOneAndUpdate({ _id: req.params.id}, { score: n }, {
        new: true,
        runValidators: true,
    })
    res.redirect('/test')

})

// @desc      Delete story
// @route     DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        await Story.remove({ _id: req.params.id })
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    } 
})


module.exports = router  