const Users = require('../models/User')
const TodoTask = require('../models/TodoTask')

module.exports.todo = async function(req,res){
    let userId = req.cookies.userId
    let importantUrgent = await TodoTask.find({important: true, urgent: true, userId: userId})
    let notImportantUrgent = await TodoTask.find({important: false, urgent: true, userId: userId})
    let importantNotUrgent = await TodoTask.find({important: true, urgent: false, userId: userId})
    let notImportantNotUrgent = await TodoTask.find({important: false, urgent: false, userId: userId})
    let user = await Users.findOne({_id: userId})
    res.render('to-do_list', {user: user,
        importantUrgent: importantUrgent,
        notImportantUrgent: notImportantUrgent,
        importantNotUrgent: importantNotUrgent,
        notImportantNotUrgent: notImportantNotUrgent,
    })
}

module.exports.todoAdd = async function(req,res) {
    let button = req.body.categoryButton
    if (button == "important and urgent") {
        const todoTask = new TodoTask({
            content: req.body.content,
            userId: req.cookies.userId,
            important: true,
            urgent: true
        })
        await todoTask.save();
        res.redirect("/todo");
    }
    if (button == "not important and urgent") {
        const todoTask = new TodoTask({
            content: req.body.content,
            userId: req.cookies.userId,
            important: false,
            urgent: true
        })
        await todoTask.save();
        res.redirect("/todo");
    }
    if (button == "important and not urgent") {
        const todoTask = new TodoTask({
            content: req.body.content,
            userId: req.cookies.userId,
            important: true,
            urgent: false
        })
        await todoTask.save();
        res.redirect("/todo");
    }
    if (button == "not important and not urgent") {
        const todoTask = new TodoTask({
            content: req.body.content,
            userId: req.cookies.userId,
            important: false,
            urgent: false
        })
        await todoTask.save();
        res.redirect("/todo");
    }
}

module.exports.deleteTask = function(req,res) {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
        res.redirect("/todo");
    });
}

module.exports.getPageTwo = async function (req,res) {
    let todoTasks = TodoTask.find({})
    let user = Users.findOne({_id: req.cookies.userId})
    res.render("to-do", {todoTasks: todoTasks,
        user:user})
}