import mongoose from "mongoose";

// defining schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    tc: {
        type: Boolean,
        required: true
    }
}, {
        timestamps: true
    }
)

// model
const UserModel = mongoose.model("User", userSchema);

export default UserModel;