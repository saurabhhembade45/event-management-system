const express = require("express");
require("dotenv").config();
const cors = require("cors");  
const userRoutes = require("./routes/User"); 

const {connectDB} = require("./config/database");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1", userRoutes); 
connectDB();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
