const bcrypt = require('bcryptjs')
const User = require('../models/User')
const { validationResult } = require('express-validator');

module.exports.login =  async function(req,res){
    const undefined = await User.findOne({email:req.body.email})

    if(undefined){
        const passwordResult = bcrypt.compareSync(req.body.password, undefined.password)
        if (passwordResult) {
            req.session.userId = undefined.id
            req.session.visitedTime = Date.now()

            await User.findOne({email: req.body.email}).updateOne({},{$set: {visitedTime: req.session.visitedTime}})
            res.cookie('userId', undefined._id)
            if (undefined.role == 'User') res.redirect('/profile')
            if (undefined.role == 'Admin') res.redirect('/admin')

        } else {
            res.status(401).json({
                message: "Password is wrong"
            })
        }
    } else {
        res.status(404).json({
            message: "User with this email does not exist"
        })
    }
}

module.exports.register = async function(req, res){
    //username email password
    const undefined = await User.findOne({email: req.body.email})

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const alert = errors.array()
        res.render('sign_up', {
            alert
        })
    }

    if(undefined) {

    } else if (errors.isEmpty()){

        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(password, salt),
        })



        try {
            await user.save()
            req.session.userId = user._id
            res.cookie('userId', user._id)
            if(user.role == 'User') res.redirect('/profile')
            if (user.role == 'Admin') res.redirect('/admin')

        } catch(e){
            console.log(e)
        }

    }
}

module.exports.logout = function(req, res){
    req.session.destroy(err => {
        if(err) {
            return res.redirect('/')
        }
        res.clearCookie("Session")
        res.clearCookie("userId")
        res.redirect('/')
    })
}