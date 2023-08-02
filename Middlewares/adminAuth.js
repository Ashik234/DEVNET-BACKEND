const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.adminAuthentication = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        return (
          res.status(401).json({ message: "Auth Failed", success: false })
        );
      } else {
        req.adminId = decoded.id;
        next()
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Auth failed", success: false });
  }
};