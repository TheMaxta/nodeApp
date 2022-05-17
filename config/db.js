const mongoose = require('mongoose')

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            //useFindAndModify: false
            //is not supported???

        })
        console.log(`Mongo DB Connected: ${conn.connection.host}`)
    } catch (err) {
        console.error(err)
        process.exit(1)

        
    }
}
module.exports = connectDB