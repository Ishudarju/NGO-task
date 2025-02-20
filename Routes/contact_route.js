const express = require("express");
const router = express.Router();
const ContactController = require("../Controller/contact_controller");
const { verifyToken, isAdmin } = require('../Middleware/auth');


router.post("/contacts", ContactController.createContact);
router.get("/contactsAll",verifyToken, isAdmin, ContactController.getAllContacts);
router.get("/pagination", verifyToken, isAdmin,ContactController.getAllContacts);
router.get("/contacts/:id", verifyToken, isAdmin,ContactController.getContactById);
router.delete("/contacts_del/:id",verifyToken, isAdmin, ContactController.deleteContact);
router.put("/contacts_up/:id", verifyToken, isAdmin,ContactController.updateContact);


module.exports = router;
