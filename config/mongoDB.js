const mongoose = require('mongoose')

const mongoDB = async () => {
    try { 
        await mongoose.connect(process.env.MONGODB_URL)
        console.log(`Connected to Database ${mongoose.connection.host}`)
    }
    catch (error) {
        console.log(`Error connecting to DB: ${error}`)
    }
}
module.exports = mongoDB;
 