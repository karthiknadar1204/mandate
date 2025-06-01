import { db } from '@/configs/db'
import { usersTable } from '@/configs/schema'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { fetchUserEmails } from '@/app/actions/email'
import { fetchMicrosoftEmails } from '@/app/actions/microsoft-email'

export default async function AdminPage() {
  const session = await auth()

  if (!session || session.user.email !== 'karthiknadar205@gmail.com') {
    redirect('/')
  }

  const users = await db.query.usersTable.findMany({
    orderBy: (users, { desc }) => [desc(users.createdAt)]
  })

  const usersWithEmails = await Promise.all(
    users.map(async (user) => {
      let emails = []
      if (user.provider === 'google') {
        emails = await fetchUserEmails(user.accessToken)
      } else if (user.provider === 'azure-ad') {
        emails = await fetchMicrosoftEmails(user.accessToken)
      }
      return { ...user, emails }
    })
  )

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recent Emails</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usersWithEmails.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img className="h-10 w-10 rounded-full" src={user.image} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 capitalize">{user.provider}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {user.emails.length > 0 ? (
                      <div className="space-y-2">
                        {user.emails.map((email, index) => (
                          <div key={index} className="border-b pb-2">
                            <div className="font-medium">{email.subject}</div>
                            <div className="text-xs text-gray-500">From: {email.from}</div>
                            <div className="text-xs text-gray-500">Date: {email.date}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500">No recent emails</div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 