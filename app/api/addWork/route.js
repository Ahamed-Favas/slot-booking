import { connectMongoDB } from "@/lib/mongodb"
import Work from "@/models/work";
import { NextResponse } from "next/server"
import { pusherServer } from "@/lib/pusher";

export async function POST(req){
    try {
        const {selectedDateTime, formattedDateTime, Location, Vacancy, Captain} = await req.json()
        await connectMongoDB();
        const work = await Work.create({date_time_raw:selectedDateTime, date_time: formattedDateTime, vacancy: Vacancy, location: Location, captain: Captain})
        const pusherChannel = 'work_channel'; // Change this to your desired Pusher channel
        const pusherEvent = 'work_added'; // Change this to your desired Pusher event
        const eventData = { work }; // Include any relevant data you want to send
        await pusherServer.trigger(pusherChannel, pusherEvent, eventData);
        return NextResponse.json({message:"Work details added"},{status:201})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:"An error occured while Adding work details"},{status:500})
    }
}