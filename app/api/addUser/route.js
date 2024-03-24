import { connectMongoDB } from "@/lib/mongodb";
import Work from "@/models/work";
import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";

export async function POST(req) {
    try {
        const { key, curr_user_phone, curr_user } = await req.json();
        await connectMongoDB();
        const work = await Work.findByIdAndUpdate(
            key,
            { $addToSet: { applicants: [curr_user_phone, curr_user] } },
            { new: true }
        );

            // Trigger Pusher event
            const pusherChannel = 'work_channel'; // Change this to your desired Pusher channel
            const pusherEvent = 'user_enrolled'; // Change this to your desired Pusher event
            const eventData = { work }; // Include any relevant data you want to send
            await pusherServer.trigger(pusherChannel, pusherEvent, eventData);

            return NextResponse.json({ message: "User enrolled" }, { status: 201 });
        }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "An error occurred while enrolling user" }, { status: 500 });
    }
}
