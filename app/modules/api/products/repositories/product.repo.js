const { default: mongoose } = require("mongoose");
const { db } = require("../../../../config/db");

class ProductRepo {
    get = async ({ filter = {} } = {}) => {
        const products = await db.products.aggregate([
            {
                $match: filter,
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category",
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
                $unwind: {
                    path: "$category",
                    preserveNullAndEmptyArrays: true,
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
                },
            },
        ]);

        return products;
    };

    getInfinite = async ({
        filter = {},
        options = {
            page: 1,
            limit: 10,
        },
    }) => {
        const products = db.products.aggregate([
            {
                $match: filter,
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category",
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
                $unwind: {
                    path: "$category",
                    preserveNullAndEmptyArrays: true,
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
                },
            },
        ]);

        return await db.products.aggregatePaginate(products, options);
    };

    getById = async (id) => {
        const product = await db.products.aggregate([
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
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category",
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
                $unwind: {
                    path: "$category",
                    preserveNullAndEmptyArrays: true,
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
                },
            },
        ]);

        return product[0];
    };

    create = async (data) => {
        return await db.products.create(data);
    };

    update = async (id, data) => {
        return await db.products.updateOne({ _id: id }, data);
    };

    delete = async (id) => {
        return await db.products.deleteOne({ _id: id });
    };

    deleteByCategory = async (categoryId) => {
        return await db.products.deleteMany({ categoryId });
    };
    fetchProductsByCategorySearch = async (categoryNameOrId) => {
        const products = await db.products.aggregate([
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category",
                },
            },
            {
                $unwind: "$category",
            },
            {
                $match: {
                    $or: [
                        {
                            "category._id": new mongoose.Types.ObjectId(
                                categoryNameOrId
                            ),
                        },
                        {
                            "category.name": {
                                $regex: categoryNameOrId,
                                $options: "i",
                            },
                        },
                    ],
                },
            },
            {
                $project: {
                    name: 1,
                    price: 1,
                    productImage: 1,
                    contactNumber: 1,
                    travelers: 1,
                    duration: 1,
                    isActive: 1,
                    "category.name": 1,

                },
            },
        ]);

        return products;
    };

    toggleIsActive = async (id) => {
        const product = await db.products.findById(id);
        console.log(id, product);
        if (!product) {
            console.log("product not found");
        }

        product.isActive = !product.isActive;
        await product.save();
        return product;
    };
}

module.exports = new ProductRepo();
