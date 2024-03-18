import { connectMongoDB } from "@/lib/mongodb";
import Work from "@/models/work";
import { NextResponse } from "next/server";

export async function PATCH(req) {
    try {
        const { key, curr_user_phone, curr_user } = await req.json();
        await connectMongoDB();
        // Find the existing Work document by its ID and update it
        await Work.findByIdAndUpdate(
            key,
            { $pull: { applicants: [curr_user_phone, curr_user] } },
            { new: true }
        );
        return NextResponse.json({ message: "applicant deleted" }, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "An error occurred while deleting applicant" }, { status: 500 });
    }
}
