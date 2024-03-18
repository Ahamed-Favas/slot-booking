import { connectMongoDB } from "@/lib/mongodb";
import Work from "@/models/work";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { key, curr_user_phone, curr_user } = await req.json();
        await connectMongoDB();
        // Find the existing Work document by its ID and update it
        await Work.findByIdAndUpdate(
            key,
            { $push: { applicants: [curr_user_phone, curr_user] } },
            { new: true }
        );
        return NextResponse.json({ message: "User enrolled" }, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "An error occurred while enrolling user" }, { status: 500 });
    }
}
