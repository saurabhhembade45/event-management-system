const Club = require("../models/clubs");
const  uploadFileToCloudinary  = require("./fileUpload"); 
// ================= CREATE CLUB =================
exports.createClub = async (req, res) => {
  try {
    const { name, description } = req.body;

    const image = req.files.image; 

    // check file type
    const fileType = image.name.split(".").pop().toLowerCase();
    const supportedTypes = ["jpg", "jpeg", "png"]; 
    if (!isFileSupported(fileType, supportedTypes)) {
      return res.status(400).json({
          success: false,
          message: "Unsupported file type. Please upload an image (jpg, jpeg, png).",
      })
    }
    console.log("body : ",req.body, image);

    // user from auth middleware
    const userId = req.user.id; 


  console.log("Uploading to Cloudinary"); 
  // ✅ upload image
  const response = await uploadFileToCloudinary(
    image,
    "clubImages"
  );
    const club = await Club.create({
      name,
      description,
      image : response.secure_url,
      createdBy: userId, 
    });

    res.status(200).json({
      success: true,
      message: "Club created successfully",
      club,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error creating club",
    });
  }
};
