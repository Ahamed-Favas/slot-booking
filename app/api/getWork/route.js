import { connectMongoDB } from "@/lib/mongodb"
import Work from "@/models/work";
import { NextResponse } from "next/server"
import { unstable_noStore } from "next/cache";
export async function GET(){
    try {
        unstable_noStore()
        await connectMongoDB();
        const works = await Work.find()
        return NextResponse.json({works},{status:200})
    } catch (error) {
        return NextResponse.json({message:"An error occured while fetching works data"},{status:500})
    }
}