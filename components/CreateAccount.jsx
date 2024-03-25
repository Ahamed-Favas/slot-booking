'use client'
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

function CreateAccount() {
  const [Name, setName] = useState("")
  const [Phone, setPhone] = useState("")
  const [error, setError] = useState("")

  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!Phone || !Name) {
      setError("All fields are neccessory")
      return
    }
    try {
      const exist_res = await fetch('api/userExists', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ Phone })
      })
      const { user } = await exist_res.json()
      if (user) {
        setError("Phone Already Added")
        return
      }
      const reg_res = await fetch('api/register', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ Name, Phone })
      })
      if (reg_res.ok) {
        const form = e.target
        form.reset()
        alert("Registration complete, Please login")
        router.push('/')
      }
      else {
        console.log("User registration failed")
      }
    }
    catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="grid place-items-center h-screen">
      <div className='shadow-lg p-5 rounded-sm border-t-4'>
        <h1 className="text-xl font-bold my-4">Request Account</h1>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" onChange={(e) => { setName(e.target.value) }}></input>
          <input type="tel" minLength="10" maxLength="10" placeholder="Phone" onChange={(e) => { setPhone(e.target.value) }}></input>
          <button className="bg-black text-white rounded-sm font-bold cursor-pointer px-3 py-0.5">Submit</button>
          <Link className="underline text-right text-sm mt-0" href={'/'}>Login</Link>
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

export default CreateAccount