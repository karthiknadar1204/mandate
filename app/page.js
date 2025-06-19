import React from 'react'
import { signIn, signOut, auth } from "@/auth"
import { createOrUpdateUser } from './actions/user'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Mail, 
  Users, 
  TrendingUp, 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  Star,
  Globe,
  Clock,
  BarChart3,
  Zap,
  Award,
  ChevronRight,
  Play,
  Quote,
  MessageSquare,
  FileText,
  Calendar,
  HelpCircle,
  ExternalLink,
  Download,
  Eye,
  Lock,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                {/* Header */}
                <header className="relative z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
                    <div className="container mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center overflow-hidden">
                                    <Image 
                                        src="/applogo.png" 
                                        alt="eItaly CRM Logo" 
                                        width={40} 
                                        height={40}
                                        className="object-contain"
                                    />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">eItaly</h1>
                                    <p className="text-xs text-gray-500">Student CRM</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Connected
                                </Badge>
                                <form action={async () => {
                                    "use server"
                                    await signOut()
                                }}>
                                    <Button variant="outline" size="sm">
                                        Sign Out
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="container mx-auto px-6 py-12">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Welcome back, {session.user.name}!
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Your eItaly CRM dashboard is ready. Track student applications, manage email communications, and streamline your admissions process.
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Students</p>
                                        <p className="text-2xl font-bold text-gray-900">1,247</p>
                                    </div>
                                    <Users className="w-8 h-8 text-blue-600" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Active Applications</p>
                                        <p className="text-2xl font-bold text-gray-900">89</p>
                                    </div>
                                    <TrendingUp className="w-8 h-8 text-green-600" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Response Rate</p>
                                        <p className="text-2xl font-bold text-gray-900">94%</p>
                                    </div>
                                    <BarChart3 className="w-8 h-8 text-purple-600" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <div className="text-center">
                        <Link href="/admin">
                            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3">
                                <Shield className="w-5 h-5 mr-2" />
                                Access Admin Dashboard
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </main>

                {/* Simple Footer */}
                <footer className="mt-auto py-8 text-center">
                    <div className="flex justify-center items-center space-x-4">
                        <Link href="/privacy-policy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                            Privacy Policy
                        </Link>
                        <span className="text-gray-400">|</span>
                        <Link href="/terms-of-service" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </footer>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            {/* Header */}
            <header className="relative z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center overflow-hidden">
                                <Image 
                                    src="/applogo.png" 
                                    alt="eItaly CRM Logo" 
                                    width={40} 
                                    height={40}
                                    className="object-contain"
                                />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">eItaly</h1>
                                <p className="text-xs text-gray-500">Student CRM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="relative z-10">
                <div className="container mx-auto px-6 py-20">
                    <div className="text-center max-w-4xl mx-auto mb-16">
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 mb-6">
                            <Zap className="w-3 h-3 mr-1" />
                            Streamline Your Student Admissions
                        </Badge>
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            The Complete
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Student CRM</span>
                            <br />
                            for Italian Institutions
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            Track student applications, manage email communications, and streamline your admissions process with our intelligent email tracking system.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <form
                                action={async () => {
                                    "use server"
                                    await signIn("google")
                                }}
                            >
                                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg">
                                    <Mail className="w-5 h-5 mr-2" />
                                    Get Started with Google
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </form>
                            <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                                <Play className="w-5 h-5 mr-2" />
                                Watch Demo
                            </Button>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <CardContent className="p-8">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                                    <Mail className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Email Tracking</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Automatically track and categorize student emails, ensuring no application falls through the cracks.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <CardContent className="p-8">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                                    <Users className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Student Management</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Centralized student database with comprehensive profiles and application status tracking.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <CardContent className="p-8">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                                    <BarChart3 className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Analytics & Insights</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Powerful analytics to track application progress, response rates, and institutional performance.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <CardContent className="p-8">
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                                    <Clock className="w-6 h-6 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Real-time Updates</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Get instant notifications and real-time updates on student applications and communications.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <CardContent className="p-8">
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                                    <Shield className="w-6 h-6 text-red-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Secure & Compliant</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Enterprise-grade security with GDPR compliance for handling sensitive student data.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <CardContent className="p-8">
                                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                                    <Award className="w-6 h-6 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Proven Results</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Trusted by 500+ Students with 94% satisfaction rate and improved efficiency.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Stats Section */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 mb-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Leading Institutions</h2>
                            <p className="text-lg text-gray-600">Join hundreds of Italian educational institutions already using eItaly CRM</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                                <div className="text-sm text-gray-600">Institutions</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-600 mb-2">50K+</div>
                                <div className="text-sm text-gray-600">Students Tracked</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-purple-600 mb-2">94%</div>
                                <div className="text-sm text-gray-600">Satisfaction Rate</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                                <div className="text-sm text-gray-600">Support</div>
                            </div>
                        </div>
                    </div>

                    {/* How It Works Section */}
                    <div className="mb-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">How eItaly CRM Works</h2>
                            <p className="text-lg text-gray-600">Simple 3-step process to transform your admissions workflow</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-2xl font-bold text-blue-600">1</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Connect Your Email</h3>
                                <p className="text-gray-600">
                                    Securely connect your Google or Microsoft email account to start tracking student communications.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-2xl font-bold text-green-600">2</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Automatic Processing</h3>
                                <p className="text-gray-600">
                                    Our AI automatically categorizes emails, extracts key information, and tracks application status.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-2xl font-bold text-purple-600">3</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Manage & Analyze</h3>
                                <p className="text-gray-600">
                                    Access your dashboard to manage applications, track progress, and gain valuable insights.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Testimonials Section */}
                    <div className="mb-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
                            <p className="text-lg text-gray-600">Hear from Italian institutions that have transformed their admissions process</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex items-center mb-4">
                                        <Quote className="w-8 h-8 text-blue-600 mr-2" />
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-4">
                                        "eItaly CRM has revolutionized how we handle student applications. The email tracking feature alone has saved us hours every week."
                                    </p>
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-sm font-semibold text-blue-600">M</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Marco Rossi</p>
                                            <p className="text-sm text-gray-500">Admissions Director, University of Milan</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex items-center mb-4">
                                        <Quote className="w-8 h-8 text-green-600 mr-2" />
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-4">
                                        "The analytics dashboard gives us incredible insights into our admissions process. We've improved our response rate by 40%."
                                    </p>
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-sm font-semibold text-green-600">S</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Sofia Bianchi</p>
                                            <p className="text-sm text-gray-500">Registrar, Politecnico di Torino</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex items-center mb-4">
                                        <Quote className="w-8 h-8 text-purple-600 mr-2" />
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-4">
                                        "The security and GDPR compliance features give us peace of mind. Highly recommended for any Italian institution."
                                    </p>
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-sm font-semibold text-purple-600">L</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Luca Ferrari</p>
                                            <p className="text-sm text-gray-500">IT Director, Sapienza University</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="mb-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                            <p className="text-lg text-gray-600">Everything you need to know about eItaly CRM</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex items-start">
                                        <HelpCircle className="w-6 h-6 text-blue-600 mr-3 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Is my data secure?</h3>
                                            <p className="text-gray-600">
                                                Yes, we use enterprise-grade encryption and are fully GDPR compliant. Your data is stored securely in EU-based servers.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex items-start">
                                        <HelpCircle className="w-6 h-6 text-green-600 mr-3 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Can I integrate with existing systems?</h3>
                                            <p className="text-gray-600">
                                                Absolutely! We offer API access and can integrate with your existing student management systems and databases.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex items-start">
                                        <HelpCircle className="w-6 h-6 text-purple-600 mr-3 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">How long does setup take?</h3>
                                            <p className="text-gray-600">
                                                Setup typically takes less than 30 minutes. Just connect your email account and you're ready to start tracking applications.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex items-start">
                                        <HelpCircle className="w-6 h-6 text-orange-600 mr-3 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Do you offer training?</h3>
                                            <p className="text-gray-600">
                                                Yes! We provide comprehensive training sessions and documentation to help your team get up and running quickly.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="text-center">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white">
                            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Admissions Process?</h2>
                            <p className="text-xl mb-8 opacity-90">
                                Join hundreds of institutions already using eItaly CRM to streamline their student management.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <form
                                    action={async () => {
                                        "use server"
                                        await signIn("google")
                                    }}
                                >
                                    <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
                                        <Mail className="w-5 h-5 mr-2" />
                                        Start Free Trial
                                        <ChevronRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </form>
                                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg">
                                    <Download className="w-5 h-5 mr-2" />
                                    Download Brochure
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Simple Footer */}
            <footer className="mt-auto py-8 text-center">
                <div className="flex justify-center items-center space-x-4">
                    <Link href="/privacy-policy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                        Privacy Policy
                    </Link>
                    <span className="text-gray-400">|</span>
                    <Link href="/terms-of-service" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                        Terms of Service
                    </Link>
                </div>
            </footer>
        </div>
    )
}

export default Page