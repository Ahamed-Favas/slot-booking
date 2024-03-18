const { connectMongoDB } = require("@/lib/mongodb")
import AdminKey from "@/models/adminkey";
import { NextResponse } from "next/server";
export async function POST(req){
    try {
        const { Key } = await req.json()
        await connectMongoDB();
        const user = await AdminKey.findOne({key: Key}).select('_id')
        return NextResponse.json({user})
    } catch (error) {
        console.log(error)
    }
}