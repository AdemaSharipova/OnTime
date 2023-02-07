const express = require('express')
const controller = require('../controllers/challenges')
const router = express.Router()



router.post('/', controller.challenges)
router.get('/', controller.showChallenges)
router.post('/selection/:title/:category', controller.action)


module.exports = router