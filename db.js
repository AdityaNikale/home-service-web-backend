const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log("Database connected sucssesfully ...");
        })
        .catch((e) => {
            console.log("Failed to connect", e);  
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB;