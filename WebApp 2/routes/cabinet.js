/*
const controller = require('../controllers/cabinet')
const express = require("express")
const router = express.Router()


const redirectLogin = (req,res,next) => {
    if (!req.session.userId) {
        res.redirect('/login')
    } else {
        next()
    }
}

*/

//router.get('/:_id', redirectLogin, controller.getCabinetPage)
//router.get('/', redirectLogin, controller.getCabinetPage)

module.exports = router
