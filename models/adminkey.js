import mongoose, { Schema, models } from "mongoose";

const adminKeySchema = new Schema({
    key : {
        type: String,
        required: false,
    }
})

const AdminKey = models.AdminKey || mongoose.model("AdminKey", adminKeySchema)
export default AdminKey