const chalk = require("chalk");

class Logger {
    info(...messages) {
        console.log(
            "[ " +
                new Date().toLocaleTimeString() +
                " ] - " +
                chalk.cyanBright("[INFO] - ", ...messages)
        );
    }

    warn(...messages) {
        console.warn(
            "[ " +
                new Date().toLocaleTimeString() +
                " ] - " +
                chalk.yellowBright("[WARNING] - ", ...messages)
        );
    }

    error(...messages) {
        console.error(
            "[ " +
                new Date().toLocaleTimeString() +
                " ] - " +
                chalk.redBright("[ERROR] - ", ...messages)
        );
    }

    debug(...messages) {
        console.debug(
            "[ " +
                new Date().toLocaleTimeString() +
                " ] - " +
                chalk.blueBright("[DEBUG] - ", ...messages)
        );
    }
}

module.exports = new Logger();
