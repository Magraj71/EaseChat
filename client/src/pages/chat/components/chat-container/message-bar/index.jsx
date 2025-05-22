import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import { useAppStore } from "@/stores";
import { useSocket } from "@/context/SocketContext";
import apiclient from "@/lib/api-client";
import { UPLOAD_FILE_ROUTE } from "@/utils/constant";

const MessageBar = () => {
  const emojiRef = useRef();
  const fileInputRef = useRef();
  const socket = useSocket();
  const { selectedChatType, selectedChatData, userInfo,sendMessage } = useAppStore();
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [message, setMessage] = useState("");
  // console.log(socket)
  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleSendMessage = async () => {
    console.log(message);
    console.log(userInfo._id);
    if (!message.trim() || !userInfo._id) return; // Ensure userInfo is available
    console.log(selectedChatType);
    try {
      if (selectedChatType === "contact") {
        socket.emit("sendMessage", {
          sender: userInfo._id,
          // Make sure sender is set
          content: message,
          recipient: selectedChatData._id,
          messageType: "text",
          fileUrl: undefined,
        });
        sendMessage(message);
        setMessage("");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0];
      console.log({ file });
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        
        const response = await apiclient.post(UPLOAD_FILE_ROUTE, formData, {
          withCredentials: true,
        });
        // console.log("Full response:", response);
        // console.log("Response data:", response.data);
        
        if (response.status === 200 && response.data) {
          const fileUrl = response.data.filePath; 
          console.log(fileUrl);
          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: userInfo._id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileUrl,
            });
      
          }
         
          // sendMessage({
          //   sender: userInfo._id,
          //   content: undefined,
          //   recipient: selectedChatData._id,
          //   messageType: "file",
          //   fileUrl,
          //   createdAt: new Date().toISOString(),
          // });
        }
      }
    } catch (error) {
      console.log({ error });
    }
  };
  
  return (
    <div className="h-[10vh] bg-[#1c1d25] flex items-center justify-center px-8 mb-5 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md gap-5 pr-5">
        <input
          type="text"
          className="flex-1 p-3 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="button"
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          onClick={handleAttachmentClick}
        >
          <GrAttachment className="text-2xl" />
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        />
        <div className="relative mt-3" ref={emojiRef}>
          <button
            type="button"
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={() => setEmojiPickerOpen((prev) => !prev)}
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          {emojiPickerOpen && (
            <div className="absolute bottom-16 right-0">
              <EmojiPicker
                theme="dark"
                onEmojiClick={handleAddEmoji}
                autoFocusSearch={false}
              />
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        className="bg-[#8417ff] rounded-md flex items-center justify-center p-3 focus:border-none focus:outline-none focus:text-white duration-300 transition-all hover:bg-[#5e15b2] focus:bg-[#5e15b2]"
        onClick={handleSendMessage}
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
