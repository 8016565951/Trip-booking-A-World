const jwt = require("jsonwebtoken");
const config = require("../config");

/**
 * @param {Object} payload
 * @param {string} payload.id
 * @param {string} secret
 * @param {string} expiresIn
 */
function signJWT(payload, secret, expiresIn) {
    return jwt.sign(payload, secret, { expiresIn });
}

/**
 * @param {string} token
 * @param {string} secret
 */
function verifyJwt(token, secret) {
    return jwt.verify(token, secret);
}

/**
 * @param {string} token
 */
function decodeJwt(token) {
    return jwt.decode(token);
}

/**
 * @param {import("express").Request} req
 */
function getTokenFromHeader(req) {
    const authHeader = req.headers["x-access-token"];
    if (!authHeader) return null;

    const token = authHeader.split(" ")[1];
    return token;
}

/**
 * @param {import("express").Request} req
 */
function getTokenFromCookie(req) {
    return req.cookies[config.auth.cookies.name];
}

module.exports = {
    signJWT,
    verifyJwt,
    decodeJwt,
    getTokenFromHeader,
    getTokenFromCookie,
};
