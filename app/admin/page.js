import { db } from '@/configs/db'
import { usersTable } from '@/configs/schema'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { fetchUserEmails } from '@/app/actions/email'
import { fetchMicrosoftEmails } from '@/app/actions/microsoft-email'
import { processEmailsInBatches } from '@/app/utils/email-processor'
import { EmailDashboard } from '@/app/components/EmailDashboard'
import { UserTable } from '@/app/components/UserTable'
import { ActionsTable } from '@/app/components/ActionsTable'
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
  CheckCircle2,
  TrendingUp,
  BarChart3
} from 'lucide-react'

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
      userEmail: user.email,
      userImage: user.image
    }))
  ).sort((a, b) => new Date(b.date) - new Date(a.date))

  const totalEmails = allEmails.length
  const totalUsers = users.length
  const googleUsers = users.filter(u => u.provider === 'google').length
  const microsoftUsers = users.filter(u => u.provider === 'microsoft-entra-id').length
  const activeUsers = users.filter(u => new Date(u.updatedAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length
  const attendedEmails = allEmails.filter(email => email.isStudentAction || email.isCounsellorAction).length
  const unattendedEmails = allEmails.filter(email => !email.isStudentAction && !email.isCounsellorAction).length
  const studentActions = allEmails.filter(email => email.isStudentAction).length
  const counsellorActions = allEmails.filter(email => email.isCounsellorAction).length

  // Filter emails for actions table
  const actionEmails = allEmails.filter(email => email.isStudentAction || email.isCounsellorAction)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage users, emails, and system actions</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              <Shield className="w-4 h-4 mr-1" />
              Admin Access
            </Badge>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white shadow-sm border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalUsers}</div>
              <p className="text-xs text-gray-500 mt-1">
                {googleUsers} Google, {microsoftUsers} Microsoft
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Emails</CardTitle>
              <Mail className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalEmails}</div>
              <p className="text-xs text-gray-500 mt-1">
                Processed and stored
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
              <Activity className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{activeUsers}</div>
              <p className="text-xs text-gray-500 mt-1">
                Last 24 hours
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">System Status</CardTitle>
              <Shield className="h-5 w-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">Healthy</div>
              <p className="text-xs text-gray-500 mt-1">
                All systems operational
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm">
            <TabsTrigger value="users" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <Users className="w-4 h-4 mr-2" />
              Users & Emails
            </TabsTrigger>
            <TabsTrigger value="emails" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <Mail className="w-4 h-4 mr-2" />
              Email Analytics
            </TabsTrigger>
            <TabsTrigger value="actions" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <Activity className="w-4 h-4 mr-2" />
              Actions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <UserTable emails={allEmails} />
          </TabsContent>

          <TabsContent value="emails" className="space-y-6">
            <EmailDashboard emails={allEmails} />
          </TabsContent>

          <TabsContent value="actions" className="space-y-6">
            {/* Action Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white shadow-sm border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Email Attendance</CardTitle>
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Attended</p>
                      <p className="text-2xl font-bold text-green-600">{attendedEmails}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Unattended</p>
                      <p className="text-2xl font-bold text-orange-600">{unattendedEmails}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Action Statistics</CardTitle>
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Student Actions</p>
                      <p className="text-2xl font-bold text-blue-600">{studentActions}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Counsellor Actions</p>
                      <p className="text-2xl font-bold text-purple-600">{counsellorActions}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions Table */}
            <ActionsTable emails={actionEmails} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 