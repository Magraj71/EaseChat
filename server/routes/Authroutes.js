import { Router } from "express";
import {login, SignUp,updateProfile} from "../Controllers/Authcontrollers.js" 
import { verifyToken } from "../middlewares/Authmiddlewares.js"; 
import { getUserInfo } from "../Controllers/Authcontrollers.js";
// 1 st
import { addProfileImage } from "../Controllers/Authcontrollers.js";
import multer from "multer";
import { logOut } from "../Controllers/Authcontrollers.js";

const upload = multer({dest:"uploads/profiles/"});

const authroute = Router();

authroute.post("/signup", SignUp);
authroute.post("/login",login);
authroute.get("/user-info"  ,getUserInfo);
authroute.post("/update-profile",verifyToken, updateProfile)
authroute.post("/add-profile-image",verifyToken,upload.single("profile-image"),addProfileImage);
authroute.post('/logOut',logOut);
export default authroute;