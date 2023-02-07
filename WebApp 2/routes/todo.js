const express = require('express')
const controller = require('../controllers/todo')
const router = express.Router()

const redirectLogin = (req,res,next) => {
    if (!req.session.userId) {
        res.redirect('/login')
    } else {
        next()
    }
}

router.get('/', redirectLogin, controller.todo)
router.get('/list', redirectLogin, controller.getPageTwo)
router.post('/addTask', redirectLogin, controller.todoAdd)
router.post('/remove/:id', redirectLogin, controller.deleteTask)



module.exports = router