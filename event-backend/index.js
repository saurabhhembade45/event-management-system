const express = require("express");
require("dotenv").config();
const cors = require("cors");  
const userRoutes = require("./routes/User");
const clubRoutes = require("./routes/clubRoutes"); 
const eventRoutes = require("./routes/eventRoutes"); 
const paymentRoutes = require("./routes/paymentRoutes"); 
const participantRoutes = require("./routes/participantRoute");
const {connectDB} = require("./config/database");
const app = express();
const fileUpload = require("express-fileupload");

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());
app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: "./tmp/",
    })
  );
  
app.use("/api/v1", userRoutes); 
connectDB();
app.use("/api/v1/clubs", clubRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/payment", paymentRoutes); 
app.use("/api/v1/participants", participantRoutes);

const PORT = process.env.PORT || 3000;
 
const { cloudinaryConnect } = require("./config/cloudinary");
cloudinaryConnect(); 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});