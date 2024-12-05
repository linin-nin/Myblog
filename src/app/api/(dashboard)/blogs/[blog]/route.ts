import { connect } from "@/lib/db"
import Blog from "@/lib/models/blog"
import Category from "@/lib/models/category"
import User from "@/lib/models/user"
import { Types } from "mongoose"
import { NextResponse } from "next/server"

export const PATCH = async(req: Request, context: {params: any}) => {
    const blogId = context.params.blog

    try {

        const body = await req.json()
        const {title, description} = body

        const {searchParams} = new URL(req.url)
        const userId = searchParams.get("userId")
        const categoryId = searchParams.get("categoryId")

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
        const category = await Category.findById(categoryId)
        if(!category) {
            return new NextResponse(
                JSON.stringify({message: "Category not fount"}),{
                    status: 404
                }
            )
        }
        
        const blog = await Blog.findOne({_id: blogId, user: userId, category: categoryId})
        if(!blog) {
            return new NextResponse(
                JSON.stringify({message: "blog not found or blog does not have in dataase."}),
                {status: 404}
            )
        }

        const updateBlog = await Blog.findByIdAndUpdate(
            blogId,
            {title, description},
            {new: true}
        )
        return new NextResponse(
            JSON.stringify({ message: "Blog updated", blog: updateBlog }),
            { status: 200 }
          );
    } catch (err:any) {
        return new NextResponse("Error in creating Blog" + err.message, {
            status: 500
        })
    }
}