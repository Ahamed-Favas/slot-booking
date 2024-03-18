import { connectMongoDB } from "@/lib/mongodb"
import User from "@/models/user";
import { NextResponse } from "next/server"

export async function POST(req){
    try {
        const {Name, Phone} = await req.json()
        await connectMongoDB();
        await User.create({name: Name, email: Phone, isAdmin: false, isAuthenticated: false})
        return NextResponse.json({message:"User Registration creds added"},{status:201})
    } catch (error) {
        return NextResponse.json({message:"An error occured while registering user"},{status:500})
    }
}