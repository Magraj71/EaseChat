import { Router } from "express";
import { getContactForDMList, searchContacts } from "../Controllers/ContactsControllers.js";
import { verifyToken } from "../middlewares/Authmiddlewares.js";

const contactsRoutes = Router()

contactsRoutes.post("/search",searchContacts)
contactsRoutes.get("/get-contacts-for-dm",verifyToken,getContactForDMList
)

export default contactsRoutes;