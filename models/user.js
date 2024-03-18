import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema({
    name : {
        type: String,
        required: true,
    },
    email : {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true
    },
    taken_Works: {
        type: Array,
        required: false
    },
    isAuthenticated: {
        type: Boolean,
        required: true
    }
}, {timestamps: true})

const User = models.User || mongoose.model("User", userSchema)
export default User