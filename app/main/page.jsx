"use server"
import MainPage from "@/components/MainPage"
// import { authOptions } from "../api/auth/[...nextauth]/route";
// import { getServerSession } from "next-auth";
import { unstable_noStore } from "next/cache";
async function getData() {
    const jobs_res = await fetch(process.env.NEXTAUTH_URL + '/api/getWork', {cache:"no-store"});
    const { works } = await jobs_res.json();
    let initialData = []
    if(works){
     initialData = (works.slice().reverse())}
    return initialData
}

// const session = await getServerSession(authOptions);

export default async function page() {
  unstable_noStore()
  const initialData = await getData()
  return(
    <div><MainPage initialData={initialData} /></div>
  )
}
