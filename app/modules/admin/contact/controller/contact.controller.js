const contactRepository = require("../../../api/contact/repository/contact.repo");
const { CResponse, handleError } = require("../../../../helpers/utils");
const user = require("../../../api/users/models/user");
const Contact = require("../../../api/contact/model/contact");

class AdminContactController {
    list = async (req, res) => {
        try {
            const contacts = await Contact.find();

            const userId = req.ctx?.user.id;

            const User = await user.findOne({ _id: userId });

            return res.render("contact/views/list", {
                title: "Contacts",
                 contacts,
                User,
            });
        } catch (error) {
            return handleError(error, res);
        }
    };
}

module.exports = new AdminContactController();
