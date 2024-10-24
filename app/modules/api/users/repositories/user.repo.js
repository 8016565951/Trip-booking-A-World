const { db } = require("../../../../config/db");

class UserRepo {
    get = async ({ filter = {} } = {}) => {
        const users = await db.users.aggregate([
            {
                $match: filter,
            },
            {
                $project: {
                    password: 0,
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

        return users;
    };

    getInfinite = async ({
        filter = {},
        options = {
            page: 1,
            limit: 10,
        },
    }) => {
        const users = db.users.aggregate([
            {
                $match: filter,
            },
            {
                $project: {
                    password: 0,
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

        return await db.users.aggregatePaginate(users, options);
    };

    getById = async (id) => {
        const user = await db.users.aggregate([
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
                $addFields: {
                    id: {
                        $toString: "$_id",
                    },
                },
            },
        ]);

        return user[0];
    };

    getByEmail = async (email) => {
        return await db.users.findOne({ email });
    };

    getByEmailOrUsername = async (email, username) => {
        return await db.users.findOne({
            $or: [{ email }, { username }],
        });
    };

    create = async (data) => {
        return await db.users.create(data);
    };

    update = async (id, data) => {
        return await db.users.updateOne({ _id: id }, data);
    };

    updatePassword = async (id, password) => {
        return await db.users.updateOne({ _id: id }, { password });
    };

    updateAvatar = async (id, avatarUrl) => {
        return await db.users.updateOne({ _id: id }, { avatarUrl });
    };

    
    updateVerification = async (userId, isVerified) => {
        return await db.users.updateOne(
            { _id: userId },
            { isVerified: isVerified }
        );
    };

    delete = async (id) => {
        return await db.users.deleteOne({ _id: id });
    };
    updateprofile = async (id, data) => {
        return await db.users.updateOne({ _id: id }, data);
    };
}

module.exports = new UserRepo();
