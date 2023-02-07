const express = require('express')
const controller = require('../controllers/admin')
const multer = require("multer");
const router = express.Router()

const storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, './public/uploads')
    },
    filename: function(req, file, callback) {
        callback(null, file.originalname)
    },
})

const upload = multer({
    storage: storage,
})


router.get('/', controller.admin)
router.get('/delete/:username', controller.delete)
router.get('/users/sortByName', controller.sortByName)
router.get('/users/sortByCity', controller.sortByCity)
router.post('/users/addUser', controller.addUser)
router.post('/edit/:username',controller.editUser)

router.get('/challenges', controller.challenges)
router.post('/challenges/addChallenge', upload.single('image'), controller.addChallenge)
router.get('/challenges/delete/:id', controller.deleteChallenge)

module.exports = router

