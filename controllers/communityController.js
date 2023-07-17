const communityModel = require("../Model/communityModel")
const {uploadToCloudinary} = require("../Config/Cloudinary")

const createCommunity = async(req,res)=>{
    try {
        const {title,image,description,type} = req.body
        const data = await uploadToCloudinary(image,"communities")
        console.log(data,"dataaaaaaaaaaaaaa");
        const newCommunity = new communityModel({
            title,
            image,
            description,
            type
        })
        const community = await newCommunity.save()
        if(community){
            res.status(200).json({success:true,message:"Commnity Created Successfully"})
        }
    } catch (error) {
       console.log(error); 
    }
}

module.exports = {
    createCommunity
}