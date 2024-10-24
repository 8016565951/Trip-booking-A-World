const bcrypt = require("bcryptjs");

async function hashPassword(password, salt = 10) {
    return await bcrypt.hash(password, salt);
}

async function comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

module.exports = {
    hashPassword,
    comparePassword,
};
