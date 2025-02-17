const db = require("../DB/db_connection");

class Contact {
  // Create a new contact
  static createContact( name, email,phone, subject, message ) {
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO contact_table (name, email_address, phone,subject, message) VALUES (?, ?,?, ?, ?)",
        [ name, email,phone, subject, message ],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  }


  

  // Get all contacts
  static getAllContacts() {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM contact_table", (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  // Get a single contact by ID
  static getContactById(id) {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM contact_table WHERE id = ?", [id], (err, result) => {
        if (err) return reject(err);
        resolve(result[0] || null);
      });
    });
  }

  // Delete a contact by ID
  static deleteContact(id) {
    return new Promise((resolve, reject) => {
      db.query("DELETE FROM contact_table WHERE id = ?", [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  static updateContact(id, name, email, subject, message) {
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE contact_table SET name = ?, email_Address = ?, subject = ?, message = ? WHERE id = ?",
        [name, email, subject, message, id],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  }
}

module.exports = Contact;
