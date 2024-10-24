const config = require("../config");
const { AppError } = require("../helpers");
const {
    getTokenFromHeader,
    verifyJwt,
    getTokenFromCookie,
} = require("../helpers/jwt");
const { CResponse, handleJWTError, handleError } = require("../helpers/utils");
const user = require("../modules/api/users/models/user");
const { paramUserSchema, queryTokenSchema } = require("../validations");

function isAuth(req, res, next) {
    const token = getTokenFromHeader(req);
    if (!token)
        return CResponse({
            res,
            message: "UNAUTHORIZED",
            longMessage: "You need to be logged in to access this route",
        });

    try {
        const payload = verifyJwt(token, config.auth.jwt.secret);
        req.ctx = { ...req.ctx, user: payload };
        next();
    } catch (err) {
        return handleJWTError(err, res);
    }
}

function isAuthUI(req, res, next) {
    const token = getTokenFromCookie(req);

    if (!token) return next();

    try {
        const payload = verifyJwt(token, config.auth.jwt.secret);

        req.ctx = { ...req.ctx, user: payload };
        next();
    } catch (err) {
        return next();
    }
}

function isAuthAdminUI(req, res, next) {
    const token = getTokenFromCookie(req);
    if (!token) return res.redirect("/dashboard/auth/admin/signin");

    try {
        const payload = verifyJwt(token, config.auth.jwt.secret);
        if (payload.role !== "admin") {
            return res.redirect("/dashboard/auth/admin/signin");
        }
        req.ctx = { ...req.ctx, user: payload };
        next();
    } catch (err) {
        return res.redirect("/dashboard/auth/admin/signin");
    }
}

async function isSameUser(req, res, next) {
    try {
        const userId = req.ctx?.user.id;
        if (!userId)
            throw new AppError(
                "You need to be logged in to access this route",
                "UNAUTHORIZED"
            );

        const { error, value } = paramUserSchema.validate(req.params);
        if (error) throw error;

        const { id } = value;

        if (userId !== id)
            throw new AppError(
                "You can only access your own data",
                "FORBIDDEN"
            );

        next();
    } catch (err) {
        return handleError(err, res);
    }
}

async function isTokenValid(req, res, next) {
    try {
        const { error, value } = queryTokenSchema.validate(req.query);
        if (error) throw error;

        const { token } = value;

        try {
            const payload = verifyJwt(token, config.email.secret);
            req.ctx = { ...req.ctx, user: payload };
            next();
        } catch (err) {
            return handleJWTError(err, res);
        }
    } catch (err) {
        return handleError(err, res);
    }
}

module.exports = {
    isAuth,
    isAuthUI,
    isSameUser,
    isTokenValid,
    isAuthAdminUI,
};
