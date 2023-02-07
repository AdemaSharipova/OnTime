const app = require('./app')

let port = process.env.PORT || 300


app.listen(port, function(){
    console.log(`Server has been started on ${port} port`)
})
