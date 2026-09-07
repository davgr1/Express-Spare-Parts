import { Schema, model } from "mongoose";

const productsSchema = new Schema({
    name:{
        type: String
    },
    image: {
        type: String
    },
    public_id : {
        type: String
    },
    stock: {
        type: String
    },
    price: {
        type: Number
    }, stock: {
        type: Number
    },
    description: {
        type: String
    },
    supplider_id: {
       type: Schema.Types.ObjectId,
       ref: "Suppliers",
    }
}, {
    timestamps: true,
    strict: false
})

export default model("Products", productsSchema, "Products")