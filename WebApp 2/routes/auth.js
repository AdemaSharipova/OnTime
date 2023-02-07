const express = require('express')
const controller = require('../controllers/auth')
const router = express.Router()
const { check } = require('express-validator');



const redirectLogin = (req,res,next) => {
    if (!req.session.userId) {
        res.redirect('/login')
    } else {
        next()
    }
}


router.post('/login', controller.login)

router.post('/register', [
    check('username', 'The username must be 5+ characters long')
        .isLength({min: 5}),
    check('email', "Email is not valid")
        .isEmail(),
    check('password', 'The password must be 7+ chars long and contain a number, ' +
        'a small and capital letter, special character')
        .isStrongPassword( {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minSymbols: 1,
        length: 7}),
], controller.register)

router.post('/logout', redirectLogin, controller.logout)


module.exports = router