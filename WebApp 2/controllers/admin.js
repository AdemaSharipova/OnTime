const User = require('../models/User')
const bcrypt = require("bcryptjs");
const Challenges = require('../models/Challenge')
const multer = require("multer")

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

module.exports.admin = async function(req, res) {
    let users = await User.find({role: 'User'})
    res.render('admin', {users:users})
}

module.exports.delete = async function(req, res) {
    let username = req.params.username
    await User.deleteOne({username: username})
    res.redirect('/admin')
}

module.exports.sortByName = async function(req, res) {
    let users = await User.find({role: 'User'}).sort({username: 1})
    res.render('admin', {users: users})
}

module.exports.sortByCity = async function(req, res) {
    let users = await User.find({role: 'User'}).sort({city: 1})
    res.render('admin', {users: users})
}

module.exports.addUser = async function(req, res) {
    const salt = bcrypt.genSaltSync(10)
    const password = req.body.password
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(password, salt),
        city: req.body.city
    })
    try {
        await user.save()
        res.redirect('/admin')
    } catch(e){
        console.log(e)
    }
}

module.exports.editUser = async function(req, res) {
    const salt = bcrypt.genSaltSync(10)
    let user = req.body
    await User.updateOne({username: req.params.username}, {$set: {
            password: bcrypt.hashSync(user.password, salt),
            username: user.username,
            city: user.city,
            email: user.email
        }})
    res.redirect('/admin')
}

module.exports.challenges = async function(req, res) {
    let challenges= await Challenges.find({}).sort({category: 1})
    res.render('adminChallenges', {challenges: challenges})
}

module.exports.addChallenge = async function(req,res) {
    const challenges = new Challenges({
        category: req.body.category,
        title:req.body.title,
        image: req.file.filename ,
        date: Date.now,
    })
    challenges.save();
    res.redirect("/admin/challenges")
}

module.exports.deleteChallenge = async function (req, res) {
    let id = req.params.id
    await Challenges.deleteOne({_id: id})
    res.redirect('/admin/challenges')
}