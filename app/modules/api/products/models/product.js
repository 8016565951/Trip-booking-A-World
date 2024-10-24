const { model, Schema } = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const productSchema = new Schema(
    {
        name: {
            type: Schema.Types.String,
            required: true,
        },
        price: {
            type: Schema.Types.Number,
            required: true,
        },
        productImage: {
            type: String,
            required: true,
        },
        contactNumber: {
            type: String,
            required: true,
        },
        travelers: {
            type: String,
            required: true,
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: "category",
            required: true,
        },
        duration: {
            type: Schema.Types.Number,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

productSchema.plugin(aggregatePaginate);

const Product = model("product", productSchema);

module.exports = Product;
