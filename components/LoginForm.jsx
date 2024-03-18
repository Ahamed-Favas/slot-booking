'use client'
import Link from "next/link"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

function LoginForm() {
  const [Phone, setPhone] = useState("")
  const [error, setError] = useState("")
  const [btnText, setbtnText] = useState("Submit")
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!Phone) {
      setError("All fields are neccessory")
      return
    }
    try {
      setbtnText("Loading...")
      const res = await signIn("credentials", { email:Phone, redirect:false})
      if (res.error) {
        setError("Phone is not registered")
        setbtnText("Submit")
        // setError(res.error)
        return
      }
      router.replace("main")
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="grid place-items-center h-screen">
      <div className='shadow-lg p-5 rounded-sm border-t-4'>
        <h1 className="text-xl font-bold my-4">Login</h1>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input maxLength="10" type="text" placeholder="Phone" onChange={(e) => { setPhone(e.target.value) }}></input>
          <button className="bg-black text-white rounded-sm font-bold cursor-pointer px-3 py-0.5">{btnText}</button>
          <Link className="underline text-right text-sm mt-0" href={'/request'}>Create Account</Link>
          {
            error && (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="bg-red-500 w-fit text-sm py-1 px-1 mt-2 rounded-md ">{error}</div>
              </div>)
          }
        </form>
      </div>
    </div>
  )}
export default LoginForm