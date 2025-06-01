'use client'

import { signIn } from 'next-auth/react'

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-8 space-y-4">
          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
              />
            </svg>
            Sign in with Google
          </button>

          <button
            onClick={() => signIn('azure-ad', { callbackUrl: '/' })}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 23 23">
              <path
                fill="currentColor"
                d="M0 0h23v23H0V0zm1 1v21h21V1H1zm7.775 7.55l-1.45 2.45h2.9l-1.45-2.45zm-1.45 3.45l1.45 2.45 1.45-2.45h-2.9zm1.45 3.45l1.45-2.45h2.9l-1.45 2.45zm3.45-1.45l2.45 1.45-2.45 1.45v-2.9zm2.45-1.45l-2.45-1.45v-2.9l2.45 1.45zm-2.45-3.45l2.45-1.45-2.45-1.45v2.9zm-1.45-3.45l1.45 2.45h2.9l-1.45-2.45z"
              />
            </svg>
            Sign in with Microsoft
          </button>
        </div>
      </div>
    </div>
  )
} 