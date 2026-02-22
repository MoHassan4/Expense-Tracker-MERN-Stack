const multer = require("multer");

// Configure Storage
const storage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null , "src/uploads/");
    },
    filename : (req,file,cb)=>{
        cb(null , `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req,file,cb)=>{
    const allowedTypes = ["image/jpeg", "image/png","image/jpg"];

    if(allowedTypes.includes(file.mimetype)){
        cb(null,true)
    }else{
        cb(new Error("Only Jpeg , Jpg , Png Are Allowed Formats"),false);
    }
}

const upload = multer({storage , fileFilter , limits: {fileSize : 5*1024*1024}});

module.exports = upload;