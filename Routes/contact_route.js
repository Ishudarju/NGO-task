const express = require("express");
const router = express.Router();
const ContactController = require("../Controller/contact_controller");
const { verifyToken, isAdmin } = require('../Middleware/auth');


router.post("/contacts", ContactController.createContact);
router.get("/contactsAll", ContactController.getAllContacts);
router.get("/pagination", ContactController.getAllContacts);
router.get("/contacts/:id", ContactController.getContactById);
router.delete("/contacts_del/:id", ContactController.deleteContact);
router.put("/contacts_up/:id", ContactController.updateContact);


module.exports = router;
