const Contact = require("../Model/contact_model");

// Create a new contact
exports.createContact = (req, res) => {
  const { name, email,phone, subject, message } = req.body;
  if (!name || !email || !subject || !message ||!phone) {
    return res.status(400).json({ error: "All fields are required" });
  }

  Contact.createContact( name, email,phone, subject, message )
    .then(() => res.status(201).json({ message: "Contact submitted successfully" }))
    .catch((error) => res.status(500).json({ error: "Internal Server Error" }));
};

// Get all contacts
exports.getAllContacts = (req, res) => {
  Contact.getAllContacts()
    .then((contacts) => res.json(contacts))
    .catch((error) => res.status(500).json({ error: "Internal Server Error" }));
};


// Update a contact
exports.updateContact = (req, res) => {
    const { id } = req.params;
    const { name, email, subject, message } = req.body;

    console.log(req.body);
  
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    Contact.updateContact(id, name, email, subject, message)
      .then((result) => {
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Contact not found" });
        }
        res.json({ message: "Contact updated successfully" });
      })
      .catch((error) => {
        console.error("Update Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
      });
  };

  
// Get a single contact by ID
exports.getContactById = (req, res) => {
  const { id } = req.params;

  Contact.getContactById(id)
    .then((contact) => {
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.json(contact);
    })
    .catch((error) => res.status(500).json({ error: "Internal Server Error" }));
};

// Delete a contact
exports.deleteContact = (req, res) => {
  const { id } = req.params;

  Contact.deleteContact(id)
    .then(() => res.json({ message: "Contact deleted successfully" }))
    .catch((error) => res.status(500).json({ error: "Internal Server Error" }));
};
