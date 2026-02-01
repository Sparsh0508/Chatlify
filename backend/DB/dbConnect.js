import mongoose from "mongoose";

let isConnected = false;

const dbConnect = async () => {
    mongoose.set('strictQuery', true);

    if (isConnected) {
        console.log("Using existing database connection");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_CONNECT);
        isConnected = db.connections[0].readyState;
        console.log("Database connected");
    } catch (err) {
        console.error("Database connection error:", err);
    }
}

export default dbConnect;