import mongoose from "mongoose";

const connectDB = async(DATABASE_URL) => {
    try {
        const DB_OPTIONS = {
            dbName: "a&a"
        }
        await mongoose.connect(DATABASE_URL, DB_OPTIONS)
        console.log("Connection successfully");
    } catch (error) {
        console.log(error);
    }
}

export default connectDB;