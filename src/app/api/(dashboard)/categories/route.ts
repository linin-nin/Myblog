import { connect } from "@/lib/db"
import Category from "@/lib/models/category"
import User from "@/lib/models/user"
import { Types } from "mongoose"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (req: Request) => {
    try {
        const { searchParams} = new URL(req.url)
        const userId = searchParams.get("userId")

        if(!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({message: "Invalid or missing userId"}),
                {status: 400}
            )
        }

        await connect()

        const user = await User.findById(userId)
        if(!user) {
            return new NextResponse(
                JSON.stringify({message: "User not fount in the database"}),
                {status: 400}
            )
        }

        const categories = await Category.find({
            user: new Types.ObjectId(userId),
        })

        return new NextResponse(
            JSON.stringify(categories), {
                status: 200
            }
        )
    } catch (err:any) {
        return new NextResponse("Error in fetching Categories" + err.message, {
            status: 500
        })
    }
}

export const POST = async (req: NextRequest) => {
    try {
        const {searchParams} = new URL(req.url)
        const userId = searchParams.get("userId")

        const {title} = await req.json()

        if(!userId|| !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({message: "Invalid or missing userId"}),
                {status: 400}
            )
        }

        await connect()

        const user = await User.findById(userId)
        if(!user) {
            return new NextResponse(
                JSON.stringify({message: "User not fount"}), {
                    status: 400
                }
            )
        }

        const newCategory = new Category({
            title,
            user: new Types.ObjectId(userId)
        })
        await newCategory.save()

        return new NextResponse(
            JSON.stringify({message: "Category is created", Category: newCategory}), {
                status: 200
            }
        )
    } catch (err:any) {
        return new NextResponse("Error in creating Categories" + err.message, {
            status: 500
        })
    }
}