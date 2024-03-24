import mongoose from "mongoose";
let connectionStatus = false
export const connectMongoDB = async () => {
    if (!connectionStatus) {
        try {
            await mongoose.connect(process.env.MONGODB_URI)
            console.log("Connected to mongodb")
            connectionStatus = true
        } catch (error) {
            console.log("Connection failed to MongoDB: ", error)
        }
    }
}