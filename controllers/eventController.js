const eventModel = require("../Model/eventModel");
const communityModel = require("../Model/communityModel");
const { uploadToCloudinary } = require("../Config/Cloudinary");

const createEvent = async (req, res) => {
  try {
    const id = req.params.id;
    const url = req.file.path
    const { title, type, date, location, description, status } =
      req.body;
     const data = await uploadToCloudinary(url, "events");
     const image = data.url
    const community = await communityModel.findById(id);
    if (!community) {
      return res
        .status(404)
        .json({ success: false, message: "Community not found" });
    }

    const newEvent = new eventModel({
      title,
      image,
      type,
      date,
      location,
      description,
      communityId: id,
      status,
    });

    const event = await newEvent.save();
    if (event) {
      res
        .status(200)
        .json({ success: true, message: "Event Created Successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error creating event" });
  }
};

const getAllEvents = async (req, res) => {
  try {
    let eventData = await eventModel.find();
    if (eventData) {
      res.status(200).json({ data: true, message: "Events", eventData });
    } else {
      res.status(200).json({ data: false, message: "No Active Events Found" });
    }
  } catch (error) {
    console.log(error);
  }
};

const getEvents = async (req, res) => {
  try {
    const id = req.params.id;
    let eventData = await eventModel.find({ communityId: id, status: true });

    if (eventData) {
      res.status(200).json({ data: true, message: "Events", eventData });
    } else {
      res.status(200).json({ data: false, message: "No Data Found" });
    }
  } catch (error) {
    console.log(error);
  }
};

const getSingleEvent = async (req, res) => {
  try {
    const id = req.params.id;
    let singleEvent = await eventModel
      .findOne({ _id: id })
      .populate("communityId")
      .exec();
    if (singleEvent) {
      return res.status(200).json({
        success: true,
        message: "Single Event",
        singleEvent,
      });
    } else {
      res.status(200).json({ data: false, message: "No Data Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEvents,
  getSingleEvent,
};
