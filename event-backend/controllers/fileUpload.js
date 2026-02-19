const clubs = require("../models/clubs"); 
const cloudinary = require("cloudinary").v2;

function isFileSupported(type, supportedTypes) {
    return supportedTypes.includes(type); 
}

const uploadFileToCloudinary = async (file, folder, quality) => {
  const options = {
    folder: folder,
    quality: quality || "auto",
  }; 
  
  const result = await cloudinary.uploader.upload(
    file.tempFilePath,
    options
  );

  return result;
};

module.exports = {
    uploadFileToCloudinary, isFileSupported
  };
  

