const express = require('express')
const app = express()
const mongoose = require('mongoose')

const PORT = 5001

const {MONGOURI} = require('./keys')


require('./models/user')

app.use(express.json())
app.use(require('./routes/auth'))

mongoose.connect(MONGOURI)
mongoose.connection.on('connected',() => {
    console.log("Connected to MongoDB")
})

mongoose.connection.on('error',(err) => {
    console.log("Error conneting to MongoDB",err)
})


app.listen(PORT,() => {
    console.log("Server Running on.......",PORT)
})

    