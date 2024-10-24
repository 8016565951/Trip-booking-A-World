require("dotenv").config();
const express = require("express");
const path = require("path");
const engine = require("ejs-locals");
const cors = require("cors");
const BP = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./app/config");
const { db } = require("./app/config/db");
const { logger, initiateErrorHandler } = require("./app/helpers");
const { readDir } = require("./app/helpers/utils");
const showRoutes = require("./app/helpers/routers");
const { route } = require("./app/routes/admin/product.routes");

const app = express();
const namedRouter = require("route-label")(app);

app.locals.dirs = {
    layouts: path.join(__dirname, "app/views/layouts"),
    partials: path.join(__dirname, "app/views/partials"),
    uipartials: path.join(__dirname, "app/views/uipartials"),
};

global.generateApiUrl = (routeName, routeParams = {}) =>
    `/api${namedRouter.urlFor(routeName, routeParams)}`;
global.generateDashUrl = (routeName, routeParams = {}) =>
    `/dashboard${namedRouter.urlFor(routeName, routeParams)}`;
global.generateUrl = (routeName, routeParams = {}) =>
    namedRouter.urlFor(routeName, routeParams);

global.sidebar = [
    {
        title: "Stats",
        route: "dashboard.stats.ui",
    },
    {
        title: "Destinations",
        items: {
            list: {
                title: "List",
                route: "category.list.ui",
            },
            create: {
                title: "Create",
                route: "category.single.create.ui",
            },
        },
    },
    {
        title: "Services",
        route: "products.list.ui",
    },
    {
        title: "Users",
        route: "users.list.ui",
    },
    {
        title: "Banners",
        items: {
            list: {
                title: "List",
                route: "banner.list.ui",
            },
            create: {
                title: "Create",
                route: "banner.single.create.ui",
            },
        },
    },
    {
        title: "About",
        route: "about.list.ui",
    },
    {
        title: "Blog",
        items: {
            list: {
                title: "List",
                route: "blog.list.ui",
            },
            create: {
                title: "Create",
                route: "blog.single.create.ui",
            },
        },
    },
    {
        title: "Bookings",
        route: "booking.list.ui",
    },
    {
        title: "Contact",
        route: "contact.list.ui",
    },
];

app.use(
    BP.json({
        limit: "10mb",
    })
);
app.use(
    BP.urlencoded({
        limit: "10mb",
        extended: true,
        parameterLimit: 10000,
    })
);

app.use(cors());
app.use(cookieParser());

app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", [
    path.join("app/views"),
    path.join("app/modules/www"),
    path.join("app/modules/admin"),
]);

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.use((req, res, next) => {
    res.header(
        "Cache-Control",
        "private, no-cache, max-age=0, must-revalidate"
    );
    res.header("Expires", "-1");
    res.header("Pragma", "no-cache");

    if (req.session && req.session.token) {
        req.headers["token"] = req.session.token;
    }

    next();
});

(async () => {
    initiateErrorHandler();

    app.get("/", (req, res) => res.redirect(generateUrl("www.list.home")));
    app.get("/dashboard", (req, res) =>
        res.redirect(generateDashUrl("dashboard.stats.ui"))
    );

    await db.connect();

    const [apiFiles, dashFiles, wwwFiles] = await Promise.all([
        readDir(path.join(__dirname, "app/routes", config.app.folders.api)),
        readDir(path.join(__dirname, "app/routes", config.app.folders.admin)),
        readDir(path.join(__dirname, "app/routes", config.app.folders.www)),
    ]);

    for (const file of apiFiles) {
        if (!file || file[0] === ".") continue;
        namedRouter.use("/api", require(file));
    }

    for (const file of dashFiles) {
        if (!file || file[0] === ".") continue;
        namedRouter.use("/dashboard", require(file));
    }

    for (const file of wwwFiles) {
        if (!file || file[0] === ".") continue;
        namedRouter.use("/", require(file));
    }

    namedRouter.buildRouteTable();

    app.listen(config.app.port, () => {
        logger.info(
            `server is running on http://localhost:${config.app.port}`
        );

        // showRoutes(namedRouter);
    });
})();
