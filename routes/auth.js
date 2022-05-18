const res = require("express/lib/response")
const passport = require('passport')
const express = require("express")
const router = express.Router()

// @desc      Auth with Google
// @route     GET /auth/google
//create a route
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// @desc      Google Authenticate Callback
// @route     GET /auth/google/callback
//create a route
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/'
}), (req, res) => {
    res.redirect('/dashboard')
})

//@desc        logout user
//@route       GET /auth/logout
router.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
})

module.exports = router  