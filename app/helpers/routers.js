const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const logger = require("./logger");
const config = require("../config");

function showRoutes(router) {
    const routes = router.getRouteTable();

    const groupedRoutes = Object.entries(routes).reduce((acc, [key, value]) => {
        if (
            !key.startsWith("auth") &&
            (key.endsWith(".ui") || key.endsWith(".http"))
        ) {
            value = `/dashboard${value}`;
        } else if (!key.endsWith(".ui") && !key.endsWith(".http")) {
            value = `/api${value}`;
        }
        const rootPath = value.split("/")[1];
        if (!acc[rootPath]) acc[rootPath] = [];
        acc[rootPath].push({ key, value });
        return acc;
    }, {});

    const routeFilePath = path.join(process.cwd(), "ROUTES.md");
    const writeStream = fs.createWriteStream(routeFilePath, { flags: "w" });

    writeStream.write(`# Registered Routes\n\n`);

    Object.entries(groupedRoutes).forEach(([rootPath, routes]) => {
        writeStream.write(
            `## ${rootPath[0].toUpperCase()}${rootPath.slice(1)}\n\n`
        );
        writeStream.write(`| Serial | Route | Path |\n`);
        writeStream.write(`| ------ | ----- | ---- |\n`);
        routes.forEach(({ key, value }, index) => {
            writeStream.write(`| ${index + 1} | ${key} | ${value} |\n`);
        });
        writeStream.write(`\n`);
    });

    writeStream.end();

    if (!config.app.isProd && config.app.isRoutePreviewEnabled) {
        logger.debug("Registered Routes");
        Object.entries(groupedRoutes).forEach(([rootPath, routes]) => {
            console.log(
                chalk.magenta(
                    `${rootPath[0].toUpperCase()}${rootPath.slice(1)}:`
                )
            );
            const tableData = routes.map(({ key, value }) => ({
                Route: key,
                Path: value,
            }));
            console.table(tableData);
        });
    }
}

module.exports = showRoutes;
