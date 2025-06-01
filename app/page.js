import React from 'react'
import { signIn, signOut, auth } from "@/auth"
import { createOrUpdateUser } from './actions/user'

const Page = async () => {
    const session = await auth()
    console.log(session)
    if(session){
        const result = await createOrUpdateUser({
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
            accessToken: session.accessToken,
            refreshToken: session.refreshToken,
            provider: session.provider
        })

        if (!result.success) {
            console.error('Failed to store user data:', result.error)
        }

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