import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Target, BookOpen, Trophy, ArrowRight, Users, Zap, Brain } from 'lucide-react'

const features = [
  { icon: Brain, title: 'AI-Powered Analysis', description: 'Get personalized skill gap analysis using advanced AI algorithms.' },
  { icon: Target, title: 'Career Goal Tracking', description: 'Define and track progress towards your dream career goals.' },
  { icon: BookOpen, title: 'Curated Learning Paths', description: 'Access personalized learning paths with vetted resources.' },
  { icon: BarChart3, title: 'Progress Analytics', description: 'Visualize your learning journey with detailed analytics.' },
  { icon: Users, title: 'Community Learning', description: 'Connect with peers and learn together in our community.' },
  { icon: Zap, title: 'Real-time Updates', description: 'Get instant updates on your progress and new opportunities.' },
]

export const LandingPage = () => {
  return (
    <div className='min-h-screen bg-gradient-hero'>
      <header className='relative'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-6'>
            <div className='flex items-center space-x-2'>
              <div className='w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center'>
                <BarChart3 className='h-6 w-6 text-white' />
              </div>
              <span className='text-2xl font-bold text-white'>SkillPath</span>
            </div>
            <div className='flex items-center space-x-4'>
              <Link to='/login'>
                <Button variant='ghost' className='text-white hover:bg-white/10'>
                  Sign In
                </Button>
              </Link>
              <Link to='/register'>
                <Button className='bg-white text-primary hover:bg-white/90'>
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className='py-20 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto text-center'>
          <h1 className='text-5xl md:text-7xl font-bold text-white mb-8 leading-tight'>
            Master Your
            <span className='block bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent'>
              Career Journey
            </span>
          </h1>
          <p className='text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed'>
            Get AI-powered skill gap analysis, personalized learning paths, and track your progress towards your dream career goals.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link to='/register'>
              <Button size='lg' className='bg-white text-primary hover:bg-white/90 text-lg px-8 py-3'>
                Start Learning Today
                <ArrowRight className='ml-2 h-5 w-5' />
              </Button>
            </Link>
            <Link to='/login'>
              <Button size='lg' variant='outline' className='bg-white text-primary hover:bg-white/10 text-lg px-8 py-3'>
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className='py-20 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold text-white mb-4'>Everything you need to succeed</h2>
            <p className='text-xl text-white/70 max-w-2xl mx-auto'>
              Our comprehensive platform provides all the tools you need to identify skill gaps, create learning paths, and achieve your career goals.
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className='bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-smooth animate-fade-in' style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader>
                    <div className='w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4'>
                      <Icon className='h-6 w-6 text-white' />
                    </div>
                    <CardTitle className='text-white'>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className='text-white/70'>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className='py-20 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto text-center'>
          <div className='bg-white/10 backdrop-blur-md rounded-2xl p-12 border border-white/20'>
            <h2 className='text-4xl font-bold text-white mb-6'>Ready to accelerate your career?</h2>
            <p className='text-xl text-white/80 mb-8'>Join thousands of professionals who have transformed their careers with SkillPath.</p>
            <Link to='/register'>
              <Button size='lg' className='bg-white text-primary hover:bg-white/90 text-lg px-12 py-4'>
                Get Started Free
                <ArrowRight className='ml-2 h-5 w-5' />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className='py-12 px-4 sm:px-6 lg:px-8 border-t border-white/20'>
        <div className='max-w-7xl mx-auto text-center'>
          <div className='flex items-center justify-center space-x-2 mb-4'>
            <div className='w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center'>
              <BarChart3 className='h-5 w-5 text-white' />
            </div>
            <span className='text-xl font-bold text-white'>SkillPath</span>
          </div>
          <p className='text-white/60'>© 2025 SkillPath. All rights reserved. Built with ❤️ for your career growth.</p>
        </div>
      </footer>
    </div>
  )
}


