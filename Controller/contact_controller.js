const Contact = require("../Model/contact_model");
const nodemailer = require("nodemailer");
require("dotenv").config();

// // Create a new contact

exports.createContact = async (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    // **Validate Request Data**
    if (!name || !email || !phone || !subject || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }

    console.log("User Email:", email);
    console.log("Admin Email:", process.env.ADMIN_EMAIL);

    try {
        const transporter = nodemailer.createTransport({
            host: "mail.evvisolutions.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // **User Email Content**
        const mailToUser = {
            from: process.env.EMAIL_USER,
            to: email,  // User's Email
            subject: "We Received Your Message",
            text: `Hello ${name},\n\nThank you for contacting us. We have received your message and will get back to you soon.\n\nBest Regards,\nSupport Team`,
        };

        // **Admin Email Content**
        const mailToAdmin = {
            from: process.env.EMAIL_USER,
            to: "iswarya@evvisolutions.com",  // Admin's Email
            subject: "New Contact Form Submission",
            text: `New contact form submission:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nSubject: ${subject}\nMessage: ${message}\n\nPlease review this submission.`,
        };

        // **Check Emails are defined before sending**
        if (!email || !process.env.ADMIN_EMAIL) {
            return res.status(400).json({ error: "Invalid recipient email address" });
        }

        // **Send Emails to User and Admin**
        await transporter.sendMail(mailToUser);
        await transporter.sendMail(mailToAdmin);

        res.status(200).json({ message: "Emails sent successfully!" });

    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Error sending email" });
    }
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
