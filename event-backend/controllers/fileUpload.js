const clubs = require("../models/clubs");
const cloudinary = require("cloudinary").v2; 

async function uploadFileToCloudinary(file, folder, quality) {
    const options = {
        folder : folder,
        quality : quality || "auto",
    };
    const result = await cloudinary.uploader.upload(file.tempFilePath, options);
    return result; 
}
function isFileSupported(type, supportedTypes) {
    return supportedTypes.includes(type); 
}

exports.uploadClubImage = async(req,res) =>  {
    try {
        const {name, description} = req.body; 
        const file = req.files.image; 
        
        if (!file) {
            return res.status(400).json({
                success : false,
                message : "No file uploaded",
            }); 
        }
        // validate file type
        const supportedTypes = ["jpeg", "png", "jpg"];
        const fileType  = file.name.split(".").pop().toLowerCase();
        if (!isFileSupported(fileType,supportedTypes)) {
            return res.status(400).json({
                success:false,
                message : "File format is not supported",
            })
        }

        console.log("Uploading to Folder"); 
        
        // Store file in cloudinary 
        const response = await uploadFileToCloudinary(file, "clubImages");
        console.log(response);

        // save in DB 
        const fileData = await clubs.create({
            name,  description, image : response.secure_url, 
        })
        res.status(200).json({
            success: true,
            imageUrl : response.secure_url, 
            message: "Image uploaded successfully", 
        }); 
    }
    catch(error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Error uploading file",
        }); 
    }
}