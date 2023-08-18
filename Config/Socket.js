const socket = require("socket.io");

let io;
let activeUsers = [];

const configureSocket = (server) => {
  io = socket(server, {
    cors: {
      origin: [process.env.BASE_URL,"https://devnetapp.netlify.app","s:/http/devnetapp.vercel.app"],
      methods: ["GET", "POST", "PATCH"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    //add new user
    //taking new user Id from client side

    socket.on("add-new-user", (newUserId) => {
      //if user is not added previously

      if (!activeUsers.some((user) => user.userId === newUserId)) {
        activeUsers.push({
          userId: newUserId,
          socketId: socket.id,
        });
      }
      console.log("connected users", activeUsers);
      io.emit("get-users", activeUsers);
    });

    // send message

    socket.on("send-message", (data) => {
      console.log(data, "recieve data");
      const { receiverId } = data;

      //getting the user

      const user = activeUsers.find((user) => user.userId === receiverId);
      console.log(user, "reciever user");
      console.log("sending from socket to :", receiverId);
      console.log("data", data);

      //sending message to the particular user using the socketid
      if (user) {
        console.log("ggggg");
        console.log("receiver user details", user);
        io.to(user.socketId).emit("receive-message", data);
      }
    });

    // disconnect

    socket.on("disconnect", () => {
      activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
      console.log("user disconnected", activeUsers);
      io.emit("get-users", activeUsers);
    });
  });

  // DISCUSSION
  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data) => {
      socket.join(data);
      console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on("send_message", (data) => {
      socket.to(data.community).emit("received_msg", data);
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
    });
  });
};
const getSocketInstance = () => {
  return io;
};

module.exports = {
  configureSocket,
  getSocketInstance,
};
