const auth = require("./auth");
const category = require("./category");
const product = require("./product");
const request = require("./request");
const response = require("./response");
const user = require("./user");

module.exports = {
    ...auth,
    ...category,
    ...product,
    ...request,
    ...response,
    ...user,
};
