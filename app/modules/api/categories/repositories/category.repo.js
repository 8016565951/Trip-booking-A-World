const { db } = require("../../../../config/db");
const category = require("../models/category");

class CategoryRepo {
    get = async ({ filter = {} } = {}) => {
        const categories = await db.categories.aggregate([
            {
                $match: filter,
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "categoryId",
                    as: "products",
                    pipeline: [
                        {
                            $addFields: {
                                id: {
                                    $toString: "$_id",
                                },
                            },
                        },
                    ],
                },
            },

            {
                $project: {
                    updatedAt: 0,
                },
            },
            {
                $addFields: {
                    id: {
                        $toString: "$_id",
                    },
                    productCount: {
                        $size: "$products",
                    },
                },
            },
        ]);

        return categories;
    };

    getInfinite = async ({
        filter = {},
        options = {
            page: 1,
            limit: 10,
        },
    }) => {
        const categories = db.categories.aggregate([
            {
                $match: filter,
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "categoryId",
                    as: "products",
                    pipeline: [
                        {
                            $addFields: {
                                id: {
                                    $toString: "$_id",
                                },
                            },
                        },
                    ],
                },
            },
            {
                $project: {
                    updatedAt: 0,
                },
            },
            {
                $addFields: {
                    id: {
                        $toString: "$_id",
                    },
                    productCount: {
                        $size: "$products",
                    },
                },
            },
        ]);

        return await db.categories.aggregatePaginate(categories, options);
    };

    getCategoryById = async (id) => {
        const category = await db.categories.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [
                            "$_id",
                            {
                                $toObjectId: id,
                            },
                        ],
                    },
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "categoryId",
                    as: "products",
                    pipeline: [
                        {
                            $addFields: {
                                id: {
                                    $toString: "$_id",
                                },
                            },
                        },
                    ],
                },
            },
            {
                $project: {
                    updatedAt: 0,
                },
            },
            {
                $addFields: {
                    id: {
                        $toString: "$_id",
                    },
                    productCount: {
                        $size: "$products",
                    },
                },
            },
        ]);

        return category[0];
    };

    getCategoryByName = async (name) => {
        return await db.categories.findOne({
            name: {
                $regex: new RegExp(`^${name}$`, "i"),
            },
        });
    };

    createCategory = async (data) => {
        return await db.categories.create(data);
    };

    updateCategory = async (id, data) => {
        return await db.categories.updateOne({ _id: id }, data);
    };

    deleteCategory = async (id) => {
        return await db.categories.deleteOne({ _id: id });
    };
    all = async () => {
        return await db.categories.find();
    };
}

module.exports = new CategoryRepo();
