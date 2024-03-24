import { connectMongoDB } from "@/lib/mongodb";
import { pusherServer } from "@/lib/pusher";
import Work from "@/models/work";
import { NextResponse } from "next/server";

export async function PATCH(req) {
    try {
        const { key, curr_user_phone, curr_user } = await req.json();
        await connectMongoDB();
        const work = await Work.findByIdAndUpdate(
            key,
            { $pull: { applicants: [curr_user_phone, curr_user] } },
            { new: true }
        );
        // Trigger Pusher event
        const pusherChannel = 'work_channel'; // Change this to your desired Pusher channel
        const pusherEvent = 'applicant_deleted'; // Change this to your desired Pusher event
        const eventData = { work }; // Include any relevant data you want to send
        await pusherServer.trigger(pusherChannel, pusherEvent, eventData);
        
        return NextResponse.json({ message: "applicant deleted" }, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "An error occurred while deleting applicant" }, { status: 500 });
    }
}
