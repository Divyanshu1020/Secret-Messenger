import mongoose from "mongoose";

type connectionObject = {
    isConnected?: number
}

const connection : connectionObject = {};

export default async function dbConnect(): Promise<void> {
    if(connection.isConnected){
        console.log("MongoDB is already connected");
        return;
    }
    
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI!);
        connection.isConnected = db.connections[1].readyState

        console.log("MongoDB connected");
    } catch (error) {
        console.log("Error connecting to MongoDB", error);
        process.exit()
    }

}