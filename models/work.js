import mongoose, { Schema, models } from "mongoose";
const workSchema = new Schema({
    vacancy : {
        type: Number,
        required: false,
    },
    location : {
        type: String,
        required: true,
    },
    date_time : {
        type: String,
        required: false,
    },
    captain: {
        type: String,
        required: false,
    },
    applicants: {
        type: Array,
        required: false,
    },
    date_time_raw : {
        type: Date,
        required: false,
    },

}, {timestamps: true})
// mongoose.deleteModel(models.Work)
const Work = models.Work || mongoose.model("Work", workSchema)
export default Work