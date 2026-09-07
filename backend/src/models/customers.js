import { Schema, model } from "mongoose";

const customerSchema = new Schema({
    full_name: {
        type: String
    },
    name: {
        type: String
    },
    email: {
        type: String
    },
    phone_number: {
        type: String
    },
    phone: {
        type: String
    },
    user: {
        type: String
    },
    password: {
        type: String
    },
    image: {
        type: String,
        default: null
    },
    status: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    strict: false
})

export default model("Customer", customerSchema, "Customer")