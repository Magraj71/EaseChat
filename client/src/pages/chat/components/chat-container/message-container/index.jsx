import { useAppStore } from "@/stores";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import apiclient from "@/lib/api-client";
import { GET_ALL_MESSAGES_ROUTE, Host } from "@/utils/constant.js";
import { IoMdArrowRoundDown } from "react-icons/io";

const MessageContainer = () => {
  const scrollRef = useRef();
  const {
    selectedChatMessages: messages,
    userInfo,
    selectedChatType,
    selectedChatData,
    setSelectedChatMessages,
  } = useAppStore();

  const [showImage, setShowImage] = useState(false);
  const [imageURL, setImageURL] = useState(null);

  useEffect(() => {
    const getMessages = async () => {
      try {
        if (!selectedChatData?._id || selectedChatType !== "contact") return;

        const response = await apiclient.post(
          GET_ALL_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );

        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log("Error fetching messages:", error.response?.data || error.message);
      }
    };

    if (selectedChatData._id && selectedChatType === "contact") {
      getMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  }, [messages]);

  const checkIfImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const renderDMMessages = (msg) => {
    const isSender = msg.sender._id !== selectedChatData._id;
    const isImage = checkIfImage(msg.fileUrl);

    const messageClasses = `${
      isSender
        ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
        : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
    } border inline-block p-4 rounded my-1 max-w-xs break-words`;

    return (
      <div className={isSender ? "text-right" : "text-left"}>
        {msg.messageType === "text" && (
          <div className={messageClasses}>{msg.content}</div>
        )}

        {msg.messageType === "file" && (
          <div className={messageClasses}>
            {isImage ? (
              <img
                src={`${Host}/${msg.fileUrl}`}
                alt="sent"
                onClick={() => {
                  setShowImage(true);
                  setImageURL(msg.fileUrl);
                }}
                className="max-w-full rounded cursor-pointer"
              />
            ) : (
              <a
                href={`${Host}/${msg.fileUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                📎 Download File
              </a>
            )}
          </div>
        )}

        <div className="text-xs text-gray-600">
          {moment(msg.createdAt || msg.timestamp).format("LT")}
        </div>
      </div>
    );
  };

  const renderMessage = () => {
    let lastDate = null;
    return messages.map((msg, index) => {
      const messageDate = moment(msg.createdAt || msg.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(msg.createdAt || msg.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(msg)}
        </div>
      );
    });
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 relative">
      {renderMessage()}
      <div ref={scrollRef}></div>

      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-full w-full flex items-center justify-center backdrop-blur-md bg-black/70">
          <div className="relative max-w-[90%] max-h-[90%]">
            <img
              src={`${Host}/${imageURL}`}
              alt="Full Size"
              className="object-contain max-h-full max-w-full rounded"
            />
            <div className="absolute top-4 right-4 flex gap-3">
              <a
                href={`${Host}/${imageURL}`}
                download
                className="bg-white/20 hover:bg-white/40 transition-all p-3 text-white rounded-full"
              >
                <IoMdArrowRoundDown size={24} />
              </a>
              <button
                onClick={() => setShowImage(false)}
                className="bg-white/20 hover:bg-white/40 transition-all p-3 text-white rounded-full"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
