const { handleError } = require("../../../../helpers/utils");
const user = require("../../../api/users/models/user");
const contactRepository = require("../../../api/contact/repository/contact.repo");
const Contact = require("../../../api/contact/model/contact");

class ContactController {
    contactui = async (req, res) => {
        try {
            const userId = req.ctx?.user.id;
            const User = await user.findOne({ _id: userId });
            res.render("contact/views/contact", {
                title: "Contact",
                User,
            });
        } catch (error) {
            handleError(res, error);
        }
    };

    createContact = async (req, res) => {
        try {
            const { name, email, phone, message } = req.body;

            const data = {
                name,
                email,
                phone,
                message,
            };

            const contact = new Contact(data);

            await contact.save();
            return res.redirect("contact");
        } catch (error) {
            return handleError(error, res);
        }
    };
}

module.exports = new ContactController();
