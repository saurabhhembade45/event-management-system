const mongoose = require('mongoose'); 

exports.connectDB = () => {
    mongoose.connect(process.env.MONGO_URL,)
    .then(() => {
        mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Connected to:", mongoose.connection.host);
    console.log("Database:", mongoose.connection.name);
});
    })
    .catch((err) => {
        console.log('Error connecting to MongoDB:', err);
    }); 
}