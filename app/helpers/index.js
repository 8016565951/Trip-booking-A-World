const logger = require("./logger");
const error = require("./error");

module.exports = {
    logger,
    ...error,
};
