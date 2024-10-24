const { z } = require("zod");

const responseMessages = z.union([
    z.literal("OK"),
    z.literal("ERROR"),
    z.literal("UNAUTHORIZED"),
    z.literal("CONFLICT"),
    z.literal("FORBIDDEN"),
    z.literal("NOT_FOUND"),
    z.literal("BAD_REQUEST"),
    z.literal("TOO_MANY_REQUESTS"),
    z.literal("INTERNAL_SERVER_ERROR"),
    z.literal("SERVICE_UNAVAILABLE"),
    z.literal("GATEWAY_TIMEOUT"),
    z.literal("UNKNOWN_ERROR"),
    z.literal("UNPROCESSABLE_ENTITY"),
    z.literal("NOT_IMPLEMENTED"),
    z.literal("CREATED"),
    z.literal("BAD_GATEWAY"),
]);

module.exports = { responseMessages };
