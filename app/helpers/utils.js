const { MulterError } = require("multer");
const { AppError } = require("./error");
const logger = require("./logger");
const { MongooseError } = require("mongoose");
const jwt = require("jsonwebtoken");
const { existsSync, unlinkSync } = require("fs");
const path = require("path");
const config = require("../config");
const { generate } = require("generate-password");
const { init } = require("@paralleldrive/cuid2");
const Joi = require("joi");
const fs = require("fs/promises");
const { ZodError } = require("zod");

/**
 * @param {unknown} err
 */
function sanitizeError(err) {
    if (err instanceof AppError) return err.message;
    else if (err instanceof Joi.ValidationError) return err.message;
    else if (err instanceof ZodError)
        return err.errors
            .map((e) =>
                e.code === "invalid_type"
                    ? `Expected ${e.expected} but received ${
                          e.received
                      } at ${e.path.join(".")}`
                    : e.message
            )
            .join(", ");
    else if (err instanceof MulterError) return err.message;
    else if (err instanceof MongooseError) return err.message;
    else if (err instanceof jwt.NotBeforeError)
        return err.message + ", the token is not yet valid";
    else if (err instanceof jwt.TokenExpiredError)
        return err.message + ", the token has expired";
    else if (err instanceof jwt.JsonWebTokenError)
        return err.message + ", the token is invalid";
    else if (err instanceof Error) return err.message;
    else return "Unknown error";
}

/**
 * @param {unknown} err
 * @param {import("express").Response} res
 */
function handleJWTError(err, res) {
    if (err instanceof jwt.NotBeforeError)
        return CResponse({
            res,
            message: "UNAUTHORIZED",
            longMessage: sanitizeError(err),
        });
    else if (err instanceof jwt.TokenExpiredError)
        return CResponse({
            res,
            message: "UNAUTHORIZED",
            longMessage: sanitizeError(err),
        });
    else if (err instanceof jwt.JsonWebTokenError)
        return CResponse({
            res,
            message: "UNAUTHORIZED",
            longMessage: sanitizeError(err),
        });
    else
        return CResponse({
            res,
            message: "UNAUTHORIZED",
            longMessage: sanitizeError(err),
        });
}

/**
 * @param {unknown} err
 * @param {import("express").Response} res
 */
function handleError(err, res) {
    logger.error(err);

    if (err instanceof AppError)
        return CResponse({
            res,
            message: err.status,
            longMessage: sanitizeError(err),
        });
    else if (err instanceof Joi.ValidationError)
        return CResponse({
            res,
            message: "BAD_REQUEST",
            longMessage: sanitizeError(err),
        });
    else if (err instanceof ZodError)
        return CResponse({
            res,
            message: "BAD_REQUEST",
            longMessage: sanitizeError(err),
        });
    else if (err instanceof MulterError)
        return CResponse({
            res,
            message: "BAD_REQUEST",
            longMessage: sanitizeError(err),
        });
    else if (err instanceof MongooseError)
        return CResponse({
            res,
            message: "ERROR",
            longMessage: sanitizeError(err),
        });
    else if (err instanceof Error)
        return CResponse({
            res,
            message: "ERROR",
            longMessage: sanitizeError(err),
        });
    else
        return CResponse({
            res,
            message: "INTERNAL_SERVER_ERROR",
            longMessage: sanitizeError(err),
        });
}

/**
 * @param {Object} options
 * @param {import("express").Response} options.res
 * @param {import("zod").z.infer<typeof import("../validations/index.js").responseMessages>} options.message
 * @param {string} [options.longMessage]
 * @param {any} [options.data]
 */
function CResponse({ res, message, longMessage, data }) {
    let code;
    let status = false;

    switch (message) {
        case "OK":
            code = 200;
            status = true;
            break;
        case "ERROR":
            code = 400;
            break;
        case "UNAUTHORIZED":
            code = 401;
            break;
        case "CONFLICT":
            code = 409;
            break;
        case "FORBIDDEN":
            code = 403;
            break;
        case "NOT_FOUND":
            code = 404;
            break;
        case "BAD_REQUEST":
            code = 400;
            break;
        case "TOO_MANY_REQUESTS":
            code = 429;
            break;
        case "INTERNAL_SERVER_ERROR":
            code = 500;
            break;
        case "SERVICE_UNAVAILABLE":
            code = 503;
            break;
        case "GATEWAY_TIMEOUT":
            code = 504;
            break;
        case "UNKNOWN_ERROR":
            code = 500;
            break;
        case "UNPROCESSABLE_ENTITY":
            code = 422;
            break;
        case "NOT_IMPLEMENTED":
            code = 501;
            break;
        case "CREATED":
            code = 201;
            status = true;
            break;
        case "BAD_GATEWAY":
            code = 502;
            break;
        default:
            code = 500;
            break;
    }

    return res.status(code).json({
        status,
        message,
        longMessage,
        data,
    });
}

function generateDbUrl() {
    const { protocol, username, password, host, name } = config.db;
    return `${protocol}://${username}:${password}@${host}/${name}`;
}

/**
 * @param {string} [filePath]
 */
function unlinkFile(filePath) {
    if (!filePath) return;
    if (existsSync(filePath)) unlinkSync(filePath);
}

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
}

/**
 * @param {Express.Multer.File} file
 */
function generateFileURL(file) {
    return `${config.app.urls.backend}/${file.path.replace(/\\/g, "/")}`;
}

/**
 * @param {string} url
 */
function getFilePathFromURL(url) {
    return "uploads/" + url.split("/uploads/")[1];
}

/**
 * @param {Express.Multer.File} file
 * @param {string} [prefix]
 */
function generateFilename(file, prefix = "item") {
    const ext = path.extname(file.originalname);
    return `${prefix}_${Date.now()}${ext}`;
}

function getDefaultImageUrl() {
    return `${config.app.urls.backend}/${config.app.files.images.paths.avatar}`;
}

/**
 * @param {string} content
 * @param {string} [separator]
 */
function slugify(content, separator = "-") {
    return content
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, separator)
        .replace(new RegExp(`${separator}{2,}`, "g"), separator);
}

/**
 * @param {Object} options
 * @param {number} [options.length]
 * @param {"upper" | "lower" | "normal"} [options.casing]
 */
function generateId(options = { length: 8, casing: "normal" }) {
    const { length, casing } = options;

    const id = init({ length })();
    switch (casing) {
        case "upper":
            return id.toUpperCase();
        case "lower":
            return id.toLowerCase();
        default:
            return id;
    }
}

function generatePassword(options) {
    return generate({
        length: 16,
        numbers: true,
        symbols: true,
        strict: true,
        ...options,
    });
}

async function isDirectory(filePath) {
    return (await fs.stat(filePath)).isDirectory();
}

async function readDir(filePath) {
    const files = await Promise.all(
        (await fs.readdir(filePath)).map(async (file) => {
            const fullPath = path.join(filePath, file);
            return (await isDirectory(fullPath)) ? readDir(fullPath) : fullPath;
        })
    );

    return files.flat();
}

module.exports = {
    generateDbUrl,
    handleError,
    handleJWTError,
    CResponse,
    sanitizeError,
    unlinkFile,
    generateFileURL,
    getFilePathFromURL,
    generateFilename,
    getDefaultImageUrl,
    generateOTP,
    slugify,
    generateId,
    generatePassword,
    isDirectory,
    readDir,
};
