import { connectMongoDB } from "@/lib/mongodb"
import Work from "@/models/work";
import { NextResponse } from "next/server"

export async function POST(req){
    try {
        const {selectedDateTime, formattedDateTime, Location, Vacancy, Captain} = await req.json()
        await connectMongoDB();
        await Work.create({date_time_raw:selectedDateTime, date_time: formattedDateTime, vacancy: Vacancy, location: Location, captain: Captain})
        return NextResponse.json({message:"Work details added"},{status:201})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:"An error occured while Adding work details"},{status:500})
    }
}