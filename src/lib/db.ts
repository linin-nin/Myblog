import mongoose from 'mongoose'


const MONGODB_URL = process.env.MONGODB_URL

export const connect = async () => {
    const connectionState = mongoose.connection.readyState;

    if(connectionState === 1) {
        console.log("Already Connected")
        return;
    }

    if(connectionState === 2) {
        console.log("Connecting...")
        return;
    }
    try {
        mongoose.connect(MONGODB_URL!, {
            dbName: 'next15restapi',
            bufferCommands: true
        })
        console.log("Connected!")
    } catch (error:any) {
        console.log("Error:", error)
        throw new Error("Error:", error)
    }
}