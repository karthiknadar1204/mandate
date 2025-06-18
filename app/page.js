import React from 'react'
import { signIn, signOut, auth } from "@/auth"
import { createOrUpdateUser } from './actions/user'
import Link from 'next/link'

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

        return (
            <div className="min-h-screen flex flex-col">
                <div className="flex-grow">
                    <p>Signed in as {session.user.email}</p>
                    <form action={async () => {
                        "use server"
                        await signOut()
                    }}>
                        <button type="submit">Sign out</button>
                    </form>
                </div>
                <footer className="py-4 text-center text-sm text-gray-600">
                    <div className="space-x-4">
                        <Link href="/privacy-policy" className="hover:text-gray-900 underline">
                            Privacy Policy
                        </Link>
                        <span>|</span>
                        <Link href="/terms-of-service" className="hover:text-gray-900 underline">
                            Terms of Service
                        </Link>
                    </div>
                </footer>
            </div>
        )
    }
    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-grow">
                <form
                    action={async () => {
                        "use server"
                        await signIn("google")
                    }}
                >
                    <button type="submit">Sign in with Google</button>
                </form>
            </div>
            <footer className="py-4 text-center text-sm text-gray-600">
                <div className="space-x-4">
                    <Link href="/privacy-policy" className="hover:text-gray-900 underline">
                        Privacy Policy
                    </Link>
                    <span>|</span>
                    <Link href="/terms-of-service" className="hover:text-gray-900 underline">
                        Terms of Service
                    </Link>
                </div>
            </footer>
        </div>
    )
}

export default Page