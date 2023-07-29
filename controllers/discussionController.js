const Discussion = require("../Model/DiscussionModel")

const addChat = async(req,res)=>{
    try {
        const {messages,communityId} = req.body
        const userId = req.userId
        const messageObj = {
            message:messages,
            from :userId,
            community:communityId
        }
        let data = await Discussion.create(messageObj)
        data = await data.populate("from")
        res.status(200).json({ data, message: "message added successfully" })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const getAllMessage = async(req,res)=>{
    try {
        const {id} = req.params
        const data = await Discussion.find({community:id}).populate("from")
        res.status(200).json({ message: data })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })    
    }
}

module.exports ={
    addChat,
    getAllMessage
}