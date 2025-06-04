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
  Shield,
  CheckCircle2
} from 'lucide-react'
import { UserTableRow } from '@/app/components/UserTableRow'

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000

export default async function AdminPage() {
  const session = await auth()

  if (!session || session.user.email !== 'karthiknadar205@gmail.com') {
    redirect('/')
  }

  // Get users with their latest emails
  const users = await db.query.usersTable.findMany({
    orderBy: (users, { desc }) => [desc(users.createdAt)]
  })

  // Process all users' emails in parallel
  const usersWithEmails = await Promise.all(
    users.map(async (user) => {
      try {
        let emails = []
        if (user.provider === 'google') {
          emails = await fetchUserEmails(user.accessToken, user.email)
        } else if (user.provider === 'microsoft-entra-id') {
          emails = await fetchMicrosoftEmails(user.accessToken, user.email)
        }
        
        // Only process emails that don't have summaries
        const emailsToProcess = emails.filter(email => !email.summary)
        if (emailsToProcess.length > 0) {
          const processedEmails = await processEmailsInBatches(emailsToProcess)
          // Merge processed emails with existing ones
          const existingEmails = emails.filter(email => email.summary)
          return { ...user, emails: [...existingEmails, ...processedEmails] }
        }
        
        return { ...user, emails }
      } catch (error) {
        console.error(`Error processing emails for user ${user.email}:`, error)
        return { ...user, emails: [] }
      }
    })
  )

  const allEmails = usersWithEmails.flatMap(user => 
    user.emails.map(email => ({
      ...email,
      userName: user.name,
      userEmail: user.email
    }))
  ).sort((a, b) => new Date(b.date) - new Date(a.date))

  const totalEmails = allEmails.length
  const totalUsers = users.length
  const googleUsers = users.filter(u => u.provider === 'google').length
  const microsoftUsers = users.filter(u => u.provider === 'microsoft-entra-id').length

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {googleUsers} Google, {microsoftUsers} Microsoft
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Emails</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEmails}</div>
              <p className="text-xs text-muted-foreground">
                Processed and stored
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => new Date(u.updatedAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Last 24 hours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Healthy</div>
              <p className="text-xs text-muted-foreground">
                All systems operational
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="emails">Emails</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">User</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">User Email</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Sender Email</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Email Subject</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Email Summary</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Email Date</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {allEmails.map((email) => (
                      <UserTableRow key={email.id} email={email} />
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="emails">
            <EmailDashboard emails={allEmails} />
          </TabsContent>

          <TabsContent value="actions">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Email Attendance</CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Attended</p>
                      <p className="text-2xl font-bold">
                        {allEmails.filter(email => email.isStudentAction || email.isCounsellorAction).length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Unattended</p>
                      <p className="text-2xl font-bold">
                        {allEmails.filter(email => !email.isStudentAction && !email.isCounsellorAction).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Action Statistics</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Student Actions</p>
                      <p className="text-2xl font-bold">
                        {allEmails.filter(email => email.isStudentAction).length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Counsellor Actions</p>
                      <p className="text-2xl font-bold">
                        {allEmails.filter(email => email.isCounsellorAction).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">From</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Student Action</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Counsellor Action</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {allEmails
                      .filter(email => email.isStudentAction || email.isCounsellorAction)
                      .map((email) => (
                        <tr key={email.id} className={`hover:bg-gray-50/50 ${
                          email.isDone ? 'bg-green-50' : ''
                        }`}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div>
                                <p className="font-medium text-gray-900">{email.subject}</p>
                                <p className="text-sm text-gray-500">To: {email.userName}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-gray-900">{email.from}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <p className="text-gray-900">
                                {new Date(email.date).toLocaleDateString()}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={email.isStudentAction ? 'default' : 'secondary'}>
                              {email.isStudentAction ? 'Yes' : 'No'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={email.isCounsellorAction ? 'default' : 'secondary'}>
                              {email.isCounsellorAction ? 'Yes' : 'No'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {email.isDone ? (
                                <Badge variant="success" className="bg-green-100 text-green-800">
                                  <CheckCircle2 className="w-4 h-4 mr-1" />
                                  Done
                                </Badge>
                              ) : (
                                <Badge variant="secondary">Pending</Badge>
                              )}
                            </div>
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 