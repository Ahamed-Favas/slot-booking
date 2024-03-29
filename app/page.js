import LoginForm from '@/components/LoginForm'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from './api/auth/[...nextauth]/route'

async function Home() {
  const session = await getServerSession(authOptions)
  if (session){redirect("/main")}
  return (
    <div><LoginForm/></div>
  )
}

export default Home