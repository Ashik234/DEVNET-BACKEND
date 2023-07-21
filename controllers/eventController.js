const eventModel = require("../Model/eventModel");
const communityModel = require("../Model/communityModel"); 

const createEvent = async (req, res) => {
  try {
    console.log("createEvent");
    const id = req.params.id;
    console.log(id);

    const { title, image, type, date, location, description } = req.body;
    
    const community = await communityModel.findById(id);
    if (!community) {
      return res.status(404).json({ success: false, message: "Community not found" });
    }

    const newEvent = new eventModel({
      title,
      image,
      type,
      date,
      location,
      description,
      community: id, 
    });

    const event = await newEvent.save();
    if (event) {
      res.status(200).json({ success: true, message: "Event Created Successfully" });
    }

    console.log(req.body);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error creating event" });
  }
};

const getEvents = async(req,res)=>{
    try { 
        let eventData = await eventModel.find({})
        if(eventData){
          res
        .status(200)
        .json({ data: true, message: "Events", eventData });
        }else {
          res.status(200).json({ data: false, message: "No Data Found" });
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
  createEvent,
  getEvents
};
