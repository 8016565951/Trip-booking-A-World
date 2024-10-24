const contact = require("../model/contact");

class ContactRepository {
    async createContact(data) {
        return await contact.create(data);
    }

    async getContact() {
        return await contact.find();
    }
}

module.exports = new ContactRepository();
