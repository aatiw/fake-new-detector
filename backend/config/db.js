import mongoose from "mongoose";


const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)

        console.log("connection established with mongo")
    } catch (error) {
        console.error("error while establishing connection with mongo", error)
        process.exit(1);
    }
}

export default connectDB;