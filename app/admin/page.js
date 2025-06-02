import { db } from '@/configs/db'
import { usersTable } from '@/configs/schema'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { fetchUserEmails } from '@/app/actions/email'
import { fetchMicrosoftEmails } from '@/app/actions/microsoft-email'
import { processEmailsInBatches } from '@/app/utils/email-processor'
import { EmailDashboard } from '@/app/components/EmailDashboard'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Mail, 
  Activity, 
  Calendar,
  Clock,
  Shield
} from 'lucide-react'

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
      } else if (user.provider === 'microsoft-entra-id') {
        emails = await fetchMicrosoftEmails(user.accessToken)
      }
      
      const processedEmails = await processEmailsInBatches(emails)
      return { ...user, emails: processedEmails }
    })
  )

  const allEmails = usersWithEmails.flatMap(user => 
    user.emails.map(email => ({
      ...email,
      userName: user.name,
      userEmail: user.email
    }))
  )

  const totalEmails = allEmails.length
  const totalUsers = users.length
  const googleUsers = users.filter(u => u.provider === 'google').length
  const microsoftUsers = users.filter(u => u.provider === 'microsoft-entra-id').length

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Admin Dashboard</CardTitle>
              <CardDescription>Monitor and manage your application</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-end">
                <Badge variant="outline" className="px-3 py-1">
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Access
                </Badge>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-semibold">{totalUsers}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Emails</p>
                <p className="text-2xl font-semibold">{totalEmails}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Google Users</p>
                <p className="text-2xl font-semibold">{googleUsers}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-50 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Microsoft Users</p>
                <p className="text-2xl font-semibold">{microsoftUsers}</p>
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="emails">Emails</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">User</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Provider</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Created</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {usersWithEmails.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img className="h-10 w-10 rounded-full" src={user.image} alt="" />
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-500">ID: {user.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-900">{user.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={user.provider === 'google' ? 'default' : 'secondary'}>
                            {user.provider}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <p className="text-gray-900">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <p className="text-gray-900">
                              {new Date(user.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="emails">
            <EmailDashboard emails={allEmails} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 