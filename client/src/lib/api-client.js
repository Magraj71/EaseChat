import axios from "axios";
import { Host } from "@/utils/constant";

// Create an axios instance with a predefined base URL
const apiclient = axios.create({
    baseURL: Host,
    withCredentials:true
});

export default apiclient;
