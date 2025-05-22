import { Server as SocketIoServer } from "socket.io";
import Message from "./models/MessageModels.js";
import User from "./models/UserModels.js";

const setSocket = (server) => {
  const io = new SocketIoServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  const disconnect = (socket) => {
    if (!socket) return;
    console.log(`Client Disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        console.log(`User ${userId} removed from userSocketMap`);
        break;
      }
    }
  };

 const sendMessage = async (message) => {
  console.log("Received message data:", message);

  if (!message?.sender || !message?.recipient) {
    console.error("Invalid message data: Missing sender or recipient.", message);
    return;
  }

  try {
    const senderSocketId = userSocketMap.get(message.sender);
    const recipientSocketId = userSocketMap.get(message.recipient);

    const createdMessage = await Message.create({
      sender: message.sender,
      recipient: message.recipient,
      content: message.content,
      messageType: message.messageType || "text",
      fileUrl:message.fileUrl,
    });

    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id email firstName lastName image color")
      .populate("recipient", "id email firstName lastName image color");

    console.log(`📡 Sending message to recipient: ${JSON.stringify(messageData)}`);

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receiveMessage", messageData);
    } else {
      console.log(`Recipient offline. Message queued.`);
    }

    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", messageData);
    }

  } catch (error) {
    console.error(`Error sending message: ${error.message}`);
  }
};

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
    } else {
      console.log("User ID not provided during connection");
    }

    // Handle receiving and sending messages
    socket.on("sendMessage", (message) => {
      message.sender = message.sender || socket.handshake.query.userId;
      sendMessage(message);
    });
    

    // Handle disconnection 
    socket.on("disconnect", () => disconnect(socket));
  });
};

export default setSocket;
