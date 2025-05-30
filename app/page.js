import React from 'react'
import { signIn,signOut,auth } from "@/auth"

const Page = async () => {
    const session = await auth()
    console.log(session)
    if(session){
        return <div>
            <p>Signed in as {session.user.email}</p>
            <form action={async () => {
                "use server"
                await signOut()
            }}>
                <button type="submit">Sign out</button>
            </form>
        </div>
    }
  return (
    <div>
      <form
        action={async () => {
          "use server"
          await signIn("google")
        }}
      >
        <button type="submit">Sign in with Google</button>
      </form>
    </div>
  )
}

export default Page