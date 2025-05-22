import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    messageType: {
        type: String,
        enum: ["text", "file"],
        required: true,
    },
    content: {
        type: String,
        validate: {
            validator: function (value) {
                return this.messageType === "text" ? !!value : true;
            },
            message: "Content is required for text messages."
        },
    },
    fileUrl: {
        type: String,
        validate: {
            validator: function (value) {
                return this.messageType === "file" ? !!value : true;
            },
            message: "File URL is required for file messages."
        },
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;
