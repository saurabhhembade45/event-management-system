// middleware/isAdmin.js
exports.isAdmin = (req, res, next) => {
    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Only Admin allowed"
      });
    }
    next();
  };