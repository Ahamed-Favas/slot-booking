'use client'
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

function AdminLoginForm() {
  const [Key, setKey] = useState("")
  const [error, setError] = useState("")
  const [btnText, setbtnText] = useState("Submit")

  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!Key) {
      setError("All fields are neccessory")
      return
    }
    try {
      setbtnText("Loading...")
      const exist_res = await fetch('api/adminCheck', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ Key })
      })
      const { user } = await exist_res.json()
      if (user) {
        router.replace("dashboard")
      }
      else{
        setError("Invalid Key")
        setbtnText("Submit")
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="grid place-items-center h-screen">
      <div className='shadow-lg p-5 rounded-sm border-t-4'>
        <h1 className="text-xl font-bold my-4">Admin Login</h1>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input maxLength="10" type="password" placeholder="Key" onChange={(e) => { setKey(e.target.value) }}></input>
          <button className="bg-black text-white rounded-sm font-bold cursor-pointer px-3 py-0.5">{btnText}</button>
          <Link className="underline text-right text-sm mt-0" href={'/main'}>Go back</Link>
          {
            error && (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="bg-red-500 w-fit text-sm py-1 px-1 mt-2 rounded-md ">{error}</div>
              </div>)
          }
        </form>
      </div>
    </div>
  )
}

export default AdminLoginForm