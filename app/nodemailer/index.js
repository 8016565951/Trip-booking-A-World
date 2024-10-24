const { transporter } = require("./transporter");
const {
    emailVerification,
    passwordUpdate,
    productEmail,
    statusUpdateMail,
} = require("./mails");
const config = require("../config");

class Mailer {
    constructor(transporter) {
        this.transporter = transporter;
        this.isMailEnabled = config.email.isEnabled;

        this.from = {
            name: config.email.service.from.name,
            address: config.email.service.from.address,
        };
    }

    sendEmailVerification = async ({ user }) => {
        if (!this.isMailEnabled) return;

        await emailVerification({
            from: this.from,
            to: [
                {
                    name: user.username,
                    address: user.email,
                },
            ],
            transporter: this.transporter,
            user,
        });
    };

    sendPasswordUpdated = async ({ user }) => {
        if (!this.isMailEnabled) return;

        await passwordUpdate({
            from: this.from,
            to: [
                {
                    name: user.username,
                    address: user.email,
                },
            ],
            transporter: this.transporter,
            user,
        });
    };

    sendProductsList = async ({ user, products }) => {
        if (!this.isMailEnabled) return;

        await productEmail({
            from: this.from,
            products,
            to: [
                {
                    name: user.username,
                    address: user.email,
                },
            ],
            transporter: this.transporter,
            user,
        });
    };

    sendBookingStatusUpdate = async ({ user, booking, status }) => {
        if (!this.isMailEnabled) return;

        await statusUpdateMail({
            transporter: this.transporter,
            user,
            booking,
            status,
        });
    };
}

module.exports = {
    mailer: new Mailer(transporter),
};
