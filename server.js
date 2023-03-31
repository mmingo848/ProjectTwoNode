const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path: './config.env'})

const app = require('./app')

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('MongoDB connection succesful'))

 
// START SERVER
const port = process.env.PORT || 3000
console.log(process.env)
app.listen(port, () => {
    console.log(`App running on port ${port}...`)
})