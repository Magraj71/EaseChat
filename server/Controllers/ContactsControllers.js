import mongoose from "mongoose";
import User from "../models/UserModels.js"
import Message from "../models/MessageModels.js";

export const searchContacts = async (req, res, next) => {
    try {
      
        const {searchTerm}=req.body
        if(searchTerm===undefined || searchTerm===null){
            res.status(400).send("searchTerm is required")

        }
        const sanitizedSearchTerm = searchTerm.replace(/[!@#$%^&*()_+\[\]{}?|]/g, "\\$&");
        const regex  = new RegExp(sanitizedSearchTerm,'i');

        const contacts = await User.find({
            $and:[
                {_id:{$ne: req.userId}},
                {
                    $or:[{firstName:regex},{lastName:regex},{email:regex}],
                },
            ],
        })
        return res.status(200).json({contacts});

        // res.status(200).send("Logout successful");

    } catch (error) {
        console.error("Error during logout:", error);
        return res.status(500).json({ error: "Internal server error during logout." });
    }
};

export const getContactForDMList = async (req, res, next) => {
  try {
    let userId = req.userId; // ✅ from middleware
    console.log("Authenticated userId:", userId);

    userId = new mongoose.Types.ObjectId(userId);

    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timestamp" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      {
        $unwind: "$contactInfo",
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          image: "$contactInfo.image",
          color: "$contactInfo.color",
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);

    return res.status(200).json({ contacts });

  } catch (error) {
    console.error("Error in getContactForDMList:", error.message, error.stack);
    return res.status(500).json({ error: "Internal server error while fetching contacts." });
  }
};
