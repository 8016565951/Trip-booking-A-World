const nodemailer = require("nodemailer");
const config = require("../config");

const transporter = nodemailer.createTransport({
    pool: true,
    host: config.email.service.host,
    port: config.email.service.port,
    secure: config.email.service.secure,
    tls: {
        servername: config.email.service.host,
    },
    auth: {
        user: config.email.service.user,
        pass: config.email.service.pass,
    },
});

module.exports = { transporter };
