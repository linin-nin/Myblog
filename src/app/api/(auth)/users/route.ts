import { connect } from "@/lib/db"
import User from "@/lib/models/user"
import { Types } from "mongoose"
import { NextResponse } from "next/server"


const ObjectId = require('mongoose').Types.ObjectId

export const GET = async() => {

    try {
        await connect()
        const users = await User.find();
        return new NextResponse(JSON.stringify(users), {status: 200})
    } catch (error:any) {
        return new NextResponse("Error in fetch Users"+ error.message, {status: 500})
    }
    
}

export const POST = async(req: Request) => {
    try {
        const body = await req.json();
        await connect()
        const newUser = new User(body)
        await newUser.save()
        return new NextResponse(
            JSON.stringify({message: "User is created", user: newUser}),
            { status: 200 }
        )
    } catch (error:any) {
        return new NextResponse("Error in fetch Users"+ error.message, {status: 500})
    }
 }

export const PATCH = async(req: Request) => {
    try {
        const body = await req.json();
        const {userid, newUsername} = body

        await connect();

        if(!userid || !newUsername) {
            return new NextResponse(
                JSON.stringify({message: "Id or new user not found"}),
                {
                    status: 400
                }
            )  
        }
        if(!Types.ObjectId.isValid(userid)) {
            return new NextResponse(
                JSON.stringify({message: "Invalid User id"}),
                {
                    status: 400
                }
            )  
        }
        const updateUser = await User.findByIdAndUpdate(
            {_id: new ObjectId(userid)},
            {username: newUsername},
            {new: true}
        )

        if(!updateUser) {
            return new NextResponse(
                JSON.stringify({message: "User not found in the database"}),{
                    status: 400
                }
            )
        }

        return new NextResponse(
            JSON.stringify({message: "User is updated", user: updateUser}),
            { status: 200}
        )
    } catch (err:any) {
        return new NextResponse("Error in updating Users"+ err.message, {status: 500})
    }
}

export const DELETE = async (req: Request) => {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if(!userId) {
            return new NextResponse(
                JSON.stringify({message: "Id or user not found"}),
                { status: 400 }
            )
        }

        if(!Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({message: "Invalid user Id"}), {
                    status: 400
                }
            )
        }

        await connect()
        const deleteUser = await User.findByIdAndDelete(
            new Types.ObjectId(userId)
        )

        if(!deleteUser) {
            return new NextResponse(
                JSON.stringify({message: "User not found in the database"}),
                { status: 400 }
            )
        }

        return new NextResponse(
            JSON.stringify({message: "User is deleted", user: deleteUser}),
            { status: 200 }
        )
    } catch (err: any) {
        return new NextResponse("Error in deleting Users"+ err.message, {status: 500})
    }
}
