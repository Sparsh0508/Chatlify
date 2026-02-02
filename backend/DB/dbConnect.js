import mongoose from "mongoose";

let cachedConnection = null;

const dbConnect = async () => {
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection;
    }

    mongoose.set('strictQuery', true);

    try {
        cachedConnection = await mongoose.connect(process.env.MONGODB_CONNECT);
        console.log("Database connected");
        return cachedConnection;
    } catch (err) {
        console.error("Database connection error:", err);
        cachedConnection = null;
        throw err;
    }
}

export default dbConnect;