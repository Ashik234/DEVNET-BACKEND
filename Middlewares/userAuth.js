const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.userAuthentication = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    console.log(token,409);
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(401).json({ message: "Auth failed", success: false });
      } else {
        req.userId = decoded.userId;
        next();
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Auth failed", success: false });
  }
};