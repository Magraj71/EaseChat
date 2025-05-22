import { useAppStore } from "@/stores";
import { Host } from "@/utils/constant";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";


const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);
// Function to get JWT token from cookies
// Function to get JWT  token from cookies
const getTokenFromCookies = () => {
    const cookies = document.cookie.split("; ");
    console.log("Cookies:", cookies);  // Add this line to debug cookies
    const jwtCookie = cookies.find(row => row.startsWith("jwt="));
    // console.log(jwtCookie)
    if (!jwtCookie) {
        console.error("JWT cookie not found");
        return null;
    }
    const token = jwtCookie.split("jwt=")[1];
    console.log("JWT Token found:", token);  // Log the token to ensure it's valid
    return token;
};



export const SocketProvider = ({ children }) => {
    const socket = useRef(null);
    const { userInfo ,addMessage,sendMessage} = useAppStore();
    const [isConnected, setIsConnected] = useState(false);
// console.log(userInfo)
    useEffect(() => {
        // console.log(userInfo.id)
        if (!userInfo ) {
            console.warn("🚨 No userInfo available, waiting for update...");
            return;
        }
        // console.log(userInfo)
        // Get JWT token from cookies
        const token = getTokenFromCookies();
        // console.log(token);
        if (!token) {
            console.warn("🚨 No JWT token found. Cannot connect to WebSocket.");
            return;
        }

        console.log(`🔗 Connecting to socket with userId: ${userInfo._id}`);

        // Initialize socket connection
        socket.current = io(Host, {
            withCredentials: true,
            extraHeaders: { Authorization: `Bearer ${token}` }, // ✅ Send JWT for authentication
            query: { userId: userInfo._id }, // ✅ Attach userId
        });

        // Socket event handlers
        socket.current.on("connect", () => {
            console.log(`🟢 Connected to socket as ${userInfo._id}`);
            setIsConnected(true);
        });

        socket.current.on("connect_error", (error) => {
            console.error("❌ Socket connection error:", error);
        });

        socket.current.on("receiveMessage", (message) => {
            console.log("📩 Received message:", message);
            sendMessage(message);
            addMessage(message);
        });

        return () => {
            console.log("🔴 Disconnecting socket...");
            socket.current?.disconnect();
            setIsConnected(false);
        };
    }, [userInfo]); 

    return (
        <SocketContext.Provider value={isConnected ? socket.current : null}>
            {children}
        </SocketContext.Provider>
    );
};


