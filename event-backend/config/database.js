const mongoose = require('mongoose'); 

exports.connectDB = () => {
    mongoose.connect(process.env.MONGO_URL,)
    .then(() => {
        console.log('Connection to MongoDB is Successfull');
    })
    .catch((err) => {
        console.log('Error connecting to MongoDB:', err);
    }); 
}