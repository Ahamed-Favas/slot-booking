import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers : [
        CredentialsProvider({
            name: "credentials",
            credential : {},
            async authorize(credentials){
                const {email} = credentials
                try {
                    await connectMongoDB()
                    const user = await User.findOne({email:email})
                    if (!user) {
                        return null
                    }
                    return user
                } catch (error) {
                console.log(error)}
            }
        }),
    ],
    session: {
        strategy: "jwt"
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
    },
    pages: {
        signIn: "/"
    },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST}