'use client'
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

function AdminDash() {
  const [btnText, setbtnText] = useState("Add work")
  const [DateTime, setDateTime] = useState(new Date())
  const [Location, setLocation] = useState("")
  const [Vacancy, setVacancy] = useState(1000)
  const [Captain, setCaptain] = useState("")
  const [error, setError] = useState("")

  const router = useRouter()

  const handleSubmit = async (e) => {
    setError("")
    e.preventDefault()
    if (!DateTime || !Location) {
      setError("Date Time and Location fields are nececssory")
      return
    }
    const selectedDateTime = new Date(DateTime);
    const currentDateTime = new Date();
    if (selectedDateTime < currentDateTime) {
        setError("Selected date and time cannot be in the past");
        return;
    }
    const timeString = selectedDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const dayOfWeek = selectedDateTime.toLocaleDateString('en-US', { weekday: 'long' })
    const formattedDateTime = `${dayOfWeek} ${selectedDateTime.getDate()}/${selectedDateTime.getMonth() + 1}/${selectedDateTime.getFullYear()} ${timeString}`;
    try {
        setbtnText("Adding...")
        const reg_res = await fetch('api/addWork', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ selectedDateTime, formattedDateTime, Location, Vacancy, Captain})
      })
      if (reg_res.ok) {
        const form = e.target
        form.reset()
        router.push('/main')
      }
      else {
        setbtnText("Add work")
        console.log("Work Added failed")
      }
    }
    catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="grid place-items-center h-screen">
    <div className='shadow-lg p-5 rounded-sm border-t-4'>
      <h1 className="text-xl font-bold my-4">Add work details</h1>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <input  type="datetime-local" placeholder="Work Date and Time" onChange={(e) => { setDateTime(e.target.value) }}></input>
        <input  type="text" placeholder="Work Location" onChange={(e) => { setLocation(e.target.value) }}></input>
        <input type="number" placeholder="Available Vacancy" onChange={(e) => { setVacancy(e.target.value) }}></input>
        <input type="text" placeholder="Captain" onChange={(e) => { setCaptain(e.target.value) }}></input>
        <button className="bg-black text-white rounded-sm font-bold cursor-pointer px-3 py-0.5">{btnText}</button>
        <Link className="underline text-right text-sm mt-0" href={'/main'}>Go back</Link>
        {error && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="bg-red-500 w-fit text-sm py-1 px-1 mt-2 rounded-md ">{error}</div>
          </div>)
        }
      </form>
    </div>
  </div>
  )
}

export default AdminDash