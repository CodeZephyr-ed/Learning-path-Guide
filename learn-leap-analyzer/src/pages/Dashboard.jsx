import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ProgressRing } from '@/components/ui/progress-ring'
import { SkillBadge } from '@/components/ui/skill-badge'
import { useAuth } from '@/contexts/AuthContext'
import { useDashboard } from '@/contexts/DashboardContext'
import { api } from '@/lib/api'
import { BarChart3, Target, BookOpen, Trophy, Plus, TrendingUp, Clock, Award, Sparkles, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const proficiencyLevels = {
  beginner: { percentage: 25, label: 'Beginner' },
  intermediate: { percentage: 50, label: 'Intermediate' },
  advanced: { percentage: 75, label: 'Advanced' },
  expert: { percentage: 100, label: 'Expert' },
}

const mockData = {
  stats: { totalSkills: 0, completedPaths: 0, inProgressPaths: 0, achievedGoals: 0, overallProgress: 0 },
  recentSkills: [],
  activePaths: [],
  upcomingGoals: [],
}

export const Dashboard = () => {
  const { user } = useAuth()
  const { skills, goals, lastUpdated, refreshData } = useDashboard()
  const [data, setData] = useState(mockData)
  const [loading, setLoading] = useState(true)

  const calculateDashboardData = () => {
    try {
      setLoading(true)
      
      const userSkills = skills
      const userGoals = goals
      
      // Calculate dashboard statistics
      const totalSkills = userSkills.length
      const recentSkills = userSkills.slice(-3).map(skill => ({
        name: skill.name,
        proficiency: skill.proficiency
      }))
      
      // Calculate overall progress based on skills proficiency
      const overallProgress = userSkills.length > 0 
        ? Math.round(userSkills.reduce((sum, skill) => {
            return sum + (proficiencyLevels[skill.proficiency]?.percentage || 0)
          }, 0) / userSkills.length)
        : 0
      
      // Process career goals
      const achievedGoals = userGoals.filter(goal => goal.progress >= 100).length
      const inProgressGoals = userGoals.filter(goal => goal.progress > 0 && goal.progress < 100).length
      const upcomingGoals = userGoals.slice(0, 3).map(goal => ({
        id: goal._id || goal.id,
        title: goal.title,
        deadline: goal.timeline,
        progress: goal.progress || 0
      }))
      
          // Learning paths will be managed separately
      const activePaths = []
      
      setData({
        stats: {
          totalSkills,
          completedPaths: activePaths.filter(path => path.progress >= 100).length,
          inProgressPaths: activePaths.filter(path => path.progress < 100).length,
          achievedGoals,
          overallProgress
        },
        recentSkills,
        activePaths,
        upcomingGoals
      })
    } catch (error) {
      console.error('Failed to calculate dashboard data:', error)
      setData(mockData)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      refreshData().then(() => {
        calculateDashboardData()
      })
    } else {
      setLoading(false)
    }
  }, [user])

  // Recalculate dashboard data when skills or goals change
  useEffect(() => {
    if (user && (skills.length > 0 || goals.length > 0 || lastUpdated)) {
      calculateDashboardData()
    }
  }, [skills, goals, lastUpdated, user])

  // Refresh data when component becomes visible (for real-time updates)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        refreshData().then(() => {
          calculateDashboardData()
        })
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [user])

  if (loading) {
    return (
      <div className='min-h-screen bg-background'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='animate-pulse space-y-6'>
            <div className='h-8 bg-muted rounded w-1/3'></div>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
              {[...Array(4)].map((_, i) => (
                <div key={i} className='h-32 bg-muted rounded'></div>
              ))}
            </div>
            <div className='h-64 bg-muted rounded'></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8'>
        {/* Header */}
        <div className='space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Welcome back, {user?.user_metadata?.full_name || 'User'}!</h1>
          <p className='text-muted-foreground'>Here's what's happening with your learning journey.</p>
        </div>

        {/* AI Skill Analysis Card */}
        <Card className='border-blue-100 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-900/50'>
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                <div className='p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40'>
                  <Sparkles className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                </div>
                <CardTitle className='text-lg'>AI Skill Analysis</CardTitle>
              </div>
              <Button 
                variant='link' 
                className='text-blue-600 dark:text-blue-400 p-0 h-auto' 
                asChild
              >
                <Link to='/ai-skill-analysis' className='flex items-center'>
                  View Full Analysis <ArrowRight className='ml-1 h-4 w-4' />
                </Link>
              </Button>
            </div>
            <CardDescription className='pt-2'>
              Get personalized insights into your skill gaps and learning opportunities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-blue-100 dark:border-blue-900/50'>
                <div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                  {data.stats.totalSkills}
                </div>
                <div className='text-sm text-muted-foreground'>Skills Tracked</div>
              </div>
              <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-blue-100 dark:border-blue-900/50'>
                <div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                  {data.stats.overallProgress}%
                </div>
                <div className='text-sm text-muted-foreground'>Overall Progress</div>
              </div>
              <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-blue-100 dark:border-blue-900/50'>
                <div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                  {data.stats.achievedGoals}
                </div>
                <div className='text-sm text-muted-foreground'>Goals Achieved</div>
              </div>
            </div>
            <div className='mt-4'>
              <Button 
                variant='outline' 
                className='w-full border-blue-200 bg-white hover:bg-blue-50 dark:bg-gray-800 dark:border-blue-800 dark:hover:bg-blue-900/30'
                asChild
              >
                <Link to='/ai-skill-analysis' className='flex items-center justify-center'>
                  <Sparkles className='mr-2 h-4 w-4' />
                  Analyze My Skills
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <Card className='bg-gradient-card shadow-skill-card hover:shadow-hover transition-smooth'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Skills</CardTitle>
              <Trophy className='h-4 w-4 text-primary' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{data.stats.totalSkills}</div>
              <p className='text-xs text-muted-foreground'>{data.stats.totalSkills === 0 ? 'Add your first skill!' : `${data.stats.totalSkills} skills tracked`}</p>
            </CardContent>
          </Card>

          <Card className='bg-gradient-card shadow-skill-card hover:shadow-hover transition-smooth'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Active Paths</CardTitle>
              <BookOpen className='h-4 w-4 text-success' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{data.stats.inProgressPaths}</div>
              <p className='text-xs text-muted-foreground'>{data.stats.completedPaths} completed</p>
            </CardContent>
          </Card>

          <Card className='bg-gradient-card shadow-skill-card hover:shadow-hover transition-smooth'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Career Goals</CardTitle>
              <Target className='h-4 w-4 text-warning' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{data.stats.achievedGoals}</div>
              <p className='text-xs text-muted-foreground'>{goals.length - data.stats.achievedGoals} in progress</p>
            </CardContent>
          </Card>

          <Card className='bg-gradient-card shadow-skill-card hover:shadow-hover transition-smooth'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Overall Progress</CardTitle>
              <TrendingUp className='h-4 w-4 text-accent' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{data.stats.overallProgress}%</div>
              <p className='text-xs text-muted-foreground'>{data.stats.overallProgress === 0 ? 'Start learning!' : 'Keep it up!'}</p>
            </CardContent>
          </Card>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>

          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <BarChart3 className='h-5 w-5 text-primary' />
                  Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent className='flex items-center justify-center'>
                <ProgressRing progress={data.stats.overallProgress} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Trophy className='h-5 w-5 text-success' />
                  Recent Skills
                </CardTitle>
                <CardDescription>Skills you've been working on</CardDescription>
              </CardHeader>
              <CardContent className='space-y-3'>
                {data.recentSkills.length > 0 ? (
                  data.recentSkills.map((skill, index) => (
                    <SkillBadge key={index} skill={skill.name} proficiency={skill.proficiency} />
                  ))
                ) : (
                  <div className='text-center text-muted-foreground py-4'>
                    <Trophy className='h-8 w-8 mx-auto mb-2 opacity-50' />
                    <p className='text-sm'>No skills added yet</p>
                    <p className='text-xs'>Start building your skill profile!</p>
                  </div>
                )}
                <Link to='/skills'>
                  <Button variant='outline' size='sm' className='w-full mt-4'>
                    Manage Skills
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Target className='h-5 w-5 text-warning' />
                  Career Goals
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {data.upcomingGoals.length > 0 ? (
                  data.upcomingGoals.map((goal) => (
                    <div key={goal.id} className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <h4 className='font-medium text-sm'>{goal.title}</h4>
                        <Award className='h-4 w-4 text-muted-foreground' />
                      </div>
                      <Progress value={goal.progress} className='h-2' />
                      <div className='flex justify-between text-xs text-muted-foreground'>
                        <span>Due: {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'No deadline'}</span>
                        <span>{goal.progress}%</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='text-center text-muted-foreground py-4'>
                    <Target className='h-8 w-8 mx-auto mb-2 opacity-50' />
                    <p className='text-sm'>No career goals yet</p>
                    <p className='text-xs'>Add your first goal to get started!</p>
                  </div>
                )}
                <Link to='/career-goals'>
                  <Button variant='outline' size='sm' className='w-full'>
                    View Goals
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard


