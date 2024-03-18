import CreateAccount from '@/components/CreateAccount'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '../api/auth/[...nextauth]/route'

async function page() {
  const session = await getServerSession(authOptions)
  if (session){redirect("/main")}

  return (
    <div><CreateAccount/></div>
  )
}

export default page