const Challenge = require("../models/Challenge")
const BlackList = require("../models/BlackList")
const SavedChallenge = require("../models/SavedChallenges")
const TodoTask = require("../models/TodoTask")
const Category = require('../models/Category')
const alert = require("alert")



module.exports.challenges = async function(req,res){
    let button = req.body.button
    let challenge = await Challenge.find({category:button})
    let blackLists = await BlackList.find({userId: req.cookies.userId})
    let savedChallenges = await SavedChallenge.find({userId: req.cookies.userId})
    let checked = false
    let categories = await Category.find({})
    console.log(categories)
    if (challenge != null && challenge != '') {
        while(!checked) {
            let n=0;
            let finishChallenge = challenge[Math.floor(Math.random() * challenge.length)]
            if (blackLists.length > savedChallenges.length) {
                for (var i = 0; i < blackLists.length; i++) {
                    if (finishChallenge.title == blackLists[i].title) {
                        n++
                    }
                }
            } else if (blackLists.length < savedChallenges.length){
                for (var i = 0; i < savedChallenges.length; i++) {
                    if (finishChallenge.title == savedChallenges[i].title) {
                        n++
                    }
                }
            } else if (blackLists.length == savedChallenges.length){
                for (var i = 0; i < savedChallenges.length; i++) {
                    if (finishChallenge.title == savedChallenges[i].title || finishChallenge.title == blackLists[i].title) {
                        n++
                    }
                }
            }

            if (n == 0) {
                checked = true;
                res.render('challenge', {
                    title: finishChallenge.title,
                    category: finishChallenge.category,
                    image: finishChallenge.image,
                    categories: categories,

                })
            }
        }

    } else {
        res.render('challenge', {
            title: "Sorry((",
            category: "no",
            image: "no-image.png",
            categories: categories,
        })
    }
}

module.exports.showChallenges = async function (req,res){
    let categories = await Category.find({})

    res.render('challenge', {
        title: "choose the category",
        category: "no",
        image: "no-image.png",
        categories: categories,
    })
}

module.exports.action = async function (req,res) {
    if (req.params.title != "choose the category" && req.params.title != "Sorry((") {
        if (req.body.buttonSel == "add") {
            const savedChallenge = new SavedChallenge({
                title: req.params.title,
                userId: req.cookies.userId,
                category: req.params.category,
            })
            savedChallenge.save()
            const todoTask = new TodoTask({
                content: req.params.title,
                userId: req.cookies.userId,
            })
            todoTask.save()
            res.redirect('/challenge')
        } else if (req.body.buttonSel == "never") {
            const blackList = new BlackList({
                title: req.params.title,
                userId: req.cookies.userId,
                category: req.params.category,
            })
            blackList.save()
            res.redirect('/challenge')
        }

    } else {
        alert("You didn't choose category")
        res.redirect('/challenge')
    }
}