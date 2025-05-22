export const createChatSlice = (set, get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    unreadMessages: [], // ✅ Track unread messages
    directedMessagesContacts:[],

    setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
    setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
    setSelectedChatMessages: (selectedChatMessages) => set({ selectedChatMessages }),
    setDirectedMessagesContacts:(directedMessagesContacts)=> set({directedMessagesContacts}),

    closeChat: () =>
        set({
            selectedChatData: undefined,
            selectedChatType: undefined,
            selectedChatMessages: [],
        }),

    // ✅ Handle sending messages
    sendMessage: (message) => {
        const selectedChatMessages = get().selectedChatMessages || [];
        const selectedChatType = get().selectedChatType;

        if (!message || !message.sender || !message.recipient) {
            console.error("❌ Invalid message structure:", message);
            return;
        }

        const updatedMessage = {
            ...message,
            recipient:
                selectedChatType === "contact"
                    ? message.recipient
                    : message.recipient?._id || message.recipient,
            sender:
                selectedChatType === "contact"
                    ? message.sender
                    : message.sender?._id || message.sender,
            timestamp: message.timestamp || new Date().toISOString(), // ✅ Ensure timestamp
        };

        console.log("📩 Sending message:", updatedMessage);

        set({
            selectedChatMessages: [...selectedChatMessages, updatedMessage].sort(
                (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
            ),
        });
    },

    // ✅ Handle received messages (real-time updates)
    addMessage: (message) => {
        const selectedChatMessages = get().selectedChatMessages || [];
        const unreadMessages = get().unreadMessages || [];
        console.log(message._id);
        if (selectedChatMessages.some((msg) => msg._id === message._id)) return;

        console.log("📩 Adding received message:", message);

        set({
            selectedChatMessages: [...selectedChatMessages, message].sort(
                (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
            ),
            unreadMessages: [...unreadMessages, message], // ✅ Store unread messages
        });
    },

    // ✅ Mark messages as read
    markMessagesAsRead: () => {
        set({ unreadMessages: [] });
    },
});




