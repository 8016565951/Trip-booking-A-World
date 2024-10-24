const contactRepository = require("../repository/contact.repo");

const { handleError, CResponse } = require("../../../../helpers/utils");

class ContactController {
    createContact = async (req, res) => {
        try {
            const data = req.body;
            await contactRepository.createContact(data);
            return CResponse({
                res,
                message: "Contact created successfully",
                data: {},
            });
        } catch (error) {
            return handleError(error, res);
        }
    };

    getContacts = async (req, res) => {
        try {
            const contacts = await contactRepository.getContacts();
            return CResponse({
                res,
                message: "OK",
                data: contacts,
            });
        } catch (error) {
            return handleError(error, res);
        }
    };
}

module.exports = new ContactController();
