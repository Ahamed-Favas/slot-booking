const { connectMongoDB } = require("@/lib/mongodb")
import User from "@/models/user";
import { NextResponse } from "next/server";
export async function POST(req){
    try {
        const { Phone } = await req.json()
        await connectMongoDB();
        const user = await User.findOne({email: Phone}).select('_id')
        return NextResponse.json({user})
    } catch (error) {
        console.log(error)
    }
}