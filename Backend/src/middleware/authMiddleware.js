const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

exports.protect = async(req,res,next)=>{
    let token = req.headers?.authorization.split(" ")[1];
    if (!token) return res.status(401).json({message : "No Authorization, no token found"});

    try{
        const decoded = await jwt.verify(token , process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    }catch(err){
        res.status(500).json({messsage : "Authorization Failed" , error : err.message});
    }
}