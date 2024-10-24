module.exports = {
    app: {
        port: process.env.PORT ?? 3005,
        appName: process.env.APP_NAME,
        env: process.env.NODE_ENV ?? "development",
        isProd: process.env.NODE_ENV === "production",
        isRoutePreviewEnabled: process.env.IS_ROUTE_PREVIEW_ENABLED === "true",
        folders: {
            admin: process.env.ADMIN_FOLDER_NAME ?? "admin",
            api: process.env.API_FOLDER_NAME ?? "api",
            www: process.env.WWW_FOLDER_NAME ?? "www",
        },
        files: {
            images: {
                types: ["image/png", "image/jpg", "image/jpeg"],
                paths: {
                    avatar: "uploads/images/avatars/default_avatar.png",
                },
            },
        },
        urls: {
            frontend: process.env.FRONTEND_URL,
            backend: process.env.BACKEND_URL,
        },
    },
    db: {
        protocol: process.env.DB_PROTOCOL,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        name: process.env.DB_NAME,
    },
    auth: {
        jwt: {
            secret: process.env.JWT_SECRET,
            expiresIn: "90d",
        },
        cookies: {
            name: "app7__user_89ay0sdu_451935",
            options: {
                secure: process.env.NODE_ENV === "production",
                sameSite: true,
                maxAge: 90 * 24 * 60 * 60 * 1000,
            },
        },
    },
    email: {
        secret: process.env.EMAIL_SECRET,
        isEnabled: process.env.IS_EMAIL_ENABLED === "true",
        service: {
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE === "true",
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
            from: {
                name: process.env.EMAIL_FROM_NAME,
                address: process.env.EMAIL_FROM_ADDRESS,
            },
        },
    },
    pages: {
        frontend: {
            base: process.env.FRONTEND_URL,
            signup: "/auth/signup",
            signin: "/auth/signin",
            verifyEmail: "/auth/verify-email",
        },
        api: {
            signin: "/api/auth/signin",
            signup: "/api/auth/signup",
            signout: "/api/auth/signout",
            verifyEmail: "/api/auth/verify-email",
        },
    },
};
