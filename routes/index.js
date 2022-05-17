const res = require("express/lib/response")

const express = require("express")
const router = express.Router()

// @desc      Login/Landing page
// @route     GET /
//create a route
router.get('/', (req, res) => {
    res.render('login')
     
})

// @desc      Dashboard page
// @route     GET /dashboard
//create a route
router.get('/dashboard', (req, res) => {
    res.render('dashboard')
     
})

// @desc      Test page
// @route     GET /test
//create a route
router.get('/test', (req, res) => {
    res.send('This is a test: Hello, World!!!')
     
})

module.exports = router  