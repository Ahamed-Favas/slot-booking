import MainPage from "@/components/MainPage"

async function getData() {
    const jobs_res = await fetch(process.env.LOCAL_URL + '/api/getWork', {cache:"no-store"});
    const { works } = await jobs_res.json();
    let initialData = []
    if(works){
     initialData = (works.slice().reverse())}
    return initialData
}

export default async function page() {
  const initialData = await getData()
  return(
    <div><MainPage initialData={initialData} /></div>
  )
}

// import Hello from "@/components/Hello";


// function page() {
//   return (
//     <div><Hello/></div>
//   )
// }

// export default page