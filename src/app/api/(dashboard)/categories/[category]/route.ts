import { connect } from "@/lib/db";
import Category from "@/lib/models/category";
import User from "@/lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server"

export const PATCH = async(req: Request, context: {params:any}) => {
    const categoryId = context.params.category;
    try {
        const body = await req.json()
        const { title } = body

        const {searchParams} = new URL(req.url)
        const userId = searchParams.get("userId")

        if(!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({message: "Invalid or missing userId"}),
                {status: 400}
            )
        }

        if(!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(
                JSON.stringify({message: "Invalid or missing categoryId"}),
                {status: 400}
            )
        }

        await connect();
        const user = await User.findById(userId)
        if(!user) {
            return new NextResponse(
                JSON.stringify({message: "User not fount"}),{
                    status: 404
                }
            )
        }

        const category = await Category.findOne(
            {_id: categoryId, user: userId}
        )
        if(!category) {
            return new NextResponse(
                JSON.stringify({message: "Category not found"}),
                {status: 404}
            )
        }

        const updateCategory = await Category.findByIdAndUpdate(
           categoryId,
           {title},
           {new: true}
        )

        return new NextResponse(
            JSON.stringify({message: "Category is updated", category: updateCategory}),
            {status: 200}
        )

    } catch (err:any) {
        return new NextResponse("Error in updating Categories" + err.message, {
            status: 500
        })
    }
}


export const DELETE = async(req: Request, context: {params: any}) => {
    const categoryId = context.params.category;

    try {
        const {searchParams} = new URL(req.url)
        const userId = searchParams.get("userId")
        if(!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({message: "Invalid or missing userId"}),
                {status: 400}
            )
        }

        if(!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(
                JSON.stringify({message: "Invalid or missing categoryId"}),
                {status: 400}
            )
        }

        await connect()
        const user = await User.findById(userId)
        if(!user) {
            return new NextResponse(
                JSON.stringify({message: "User not fount"}),{
                    status: 404
                }
            ) 
        }
        const category = await Category.findOne(
            {_id: categoryId, user: userId}
        )
        if(!category) {
            return new NextResponse(
                JSON.stringify({message: "Category not found or does not belong tothe user"}),
                {status: 404}
            )
        }

        await Category.findByIdAndDelete(categoryId)
        return new NextResponse(
            JSON.stringify({message: "Category is deleted"}),
            {status: 200}
        )
    } catch (error:any) {
        return new NextResponse("Error in deleting Categories" + error.message, {
            status: 500
        })
    }
}