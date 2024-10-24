const mongoose = require("mongoose");
const { logger } = require("../helpers");
const { generateDbUrl } = require("../helpers/utils");
const user = require("../modules/api/users/models/user");
const category = require("../modules/api/categories/models/category");
const product = require("../modules/api/products/models/product");

class Database {
    #uri;

    /**
     * @param {string} uri
     */
    constructor(uri) {
        this.#uri = uri;
        this.users = user;
        this.categories = category;
        this.products = product;
    }

    connect = async () => {
        const connection = await mongoose.connect(this.#uri);
        logger.info(`Connected to database : ${connection.connection.name}`);
    };

    disconnect = async () => {
        await mongoose.disconnect();
        logger.info("Disconnected from database");
    };
}

const db = new Database(generateDbUrl());

module.exports = { db };
