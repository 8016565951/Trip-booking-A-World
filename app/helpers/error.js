const logger = require("./logger");

class AppError extends Error {
    /**
     * @param {string} message
     * @param {import("zod").z.infer<typeof import("../validations/index.js").responseMessages>} status
     */
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

function initiateErrorHandler() {
    logger.info("Error Handler initiated");

    process.on("uncaughtException", (err) =>
        logger.error(`Uncaught Exception : ${err}`)
    );
    process.on("uncaughtExceptionMonitor", (err) =>
        logger.error(`Uncaught Exception (Monitor) : ${err}`)
    );
    process.on("unhandledRejection", (reason) =>
        logger.error(`Unhandled Rejection/Catch : ${reason}`)
    );
}

module.exports = {
    AppError,
    initiateErrorHandler,
};
