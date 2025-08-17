import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Target, Calendar, Building, Edit, Trash2, TrendingUp } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useDashboard } from '@/contexts/DashboardContext'
import { api } from '@/lib/api'

const mockGoals = [
  {
    id: '1',
    title: 'Senior Full-Stack Developer',
    description:
      'Advance to a senior-level position with expertise in modern web technologies and team leadership skills.',
    target_role: 'Senior Full-Stack Developer',
    target_company: 'Google',
    timeline: '2024-12-31',
    user_id: '1',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    progress: 78,
    skills_needed: ['Advanced React', 'System Design', 'Team Leadership'],
    skills_completed: ['React', 'Node.js', 'TypeScript'],
  },
  {
    id: '2',
    title: 'DevOps Engineer',
    description: 'Transition into DevOps role with strong cloud infrastructure and automation skills.',
    target_role: 'DevOps Engineer',
    target_company: 'Amazon',
    timeline: '2025-06-30',
    user_id: '1',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    progress: 45,
    skills_needed: ['Kubernetes', 'Terraform', 'CI/CD'],
    skills_completed: ['Docker', 'AWS'],
  },
]

const timelineOptions = [
  { value: '3-months', label: '3 Months' },
  { value: '6-months', label: '6 Months' },
  { value: '1-year', label: '1 Year' },
  { value: '2-years', label: '2 Years' },
  { value: '3-years', label: '3+ Years' },
]

const popularRoles = [
  'Software Engineer',
  'Senior Software Engineer',
  'Full-Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'DevOps Engineer',
  'Data Scientist',
  'Product Manager',
  'Engineering Manager',
  'Solution Architect',
  'UI/UX Designer',
  'Machine Learning Engineer',
]

export const CareerGoals = () => {
  const { user } = useAuth()
  const { goals, refreshData, addGoal, updateGoal, removeGoal } = useDashboard()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [loading, setLoading] = useState(true)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm()

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        await refreshData()
      } catch (error) {
        console.error('Failed to load career goals:', error)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const onSubmit = async (data) => {
    try {
      if (editingGoal) {
        const { data: updated } = await api.put(`/users/career-goals/${editingGoal._id}`, data)
        updateGoal(editingGoal._id, updated)
      } else {
        const { data: created } = await api.post('/users/career-goals', {
          ...data,
          progress: 0,
          skills_needed: [],
          skills_completed: [],
        })
        addGoal(created)
      }
      setIsDialogOpen(false)
      setEditingGoal(null)
      reset()
    } catch (error) {
      console.error('Failed to save career goal:', error)
      // Fallback to local state update if API fails
      if (editingGoal) {
        const updatedGoal = { ...editingGoal, ...data, updated_at: new Date().toISOString() }
        updateGoal(editingGoal._id || editingGoal.id, updatedGoal)
      } else {
        const newGoal = {
          _id: Date.now().toString(),
          id: Date.now().toString(),
          ...data,
          user_id: user?.id || '1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          progress: 0,
          skills_needed: [],
          skills_completed: [],
        }
        addGoal(newGoal)
      }
      setIsDialogOpen(false)
      setEditingGoal(null)
      reset()
    }
  }

  const handleEdit = (goal) => {
    setEditingGoal(goal)
    setValue('title', goal.title)
    setValue('description', goal.description)
    setValue('target_role', goal.target_role)
    setValue('target_company', goal.target_company || '')
    setValue('timeline', goal.timeline)
    setIsDialogOpen(true)
  }

  const handleDelete = async (goalId) => {
    try {
      await api.delete(`/users/career-goals/${goalId}`)
      removeGoal(goalId)
    } catch (error) {
      console.error('Failed to delete career goal:', error)
      // Fallback to local state update if API fails
      removeGoal(goalId)
    }
  }

  const getStatusColor = (progress) => {
    if (progress >= 80) return 'bg-success'
    if (progress >= 50) return 'bg-warning'
    return 'bg-primary'
  }

  const getStatusText = (progress) => {
    if (progress >= 80) return 'Near Completion'
    if (progress >= 50) return 'Good Progress'
    if (progress >= 25) return 'In Progress'
    return 'Getting Started'
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-foreground mb-2'>Career Goals</h1>
            <p className='text-muted-foreground'>Define and track your career objectives</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingGoal(null)
                  reset()
                }}
              >
                <Plus className='h-4 w-4 mr-2' />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent className='max-w-2xl'>
              <DialogHeader>
                <DialogTitle>{editingGoal ? 'Edit Career Goal' : 'Add New Career Goal'}</DialogTitle>
                <DialogDescription>
                  {editingGoal ? 'Update your career goal information' : 'Define a new career objective and target role'}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='title'>Goal Title</Label>
                  <Input id='title' placeholder='e.g., Become a Senior Software Engineer' {...register('title', { required: 'Goal title is required' })} />
                  {errors.title && <p className='text-sm text-destructive'>{errors.title.message}</p>}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='description'>Description</Label>
                  <Textarea id='description' placeholder='Describe your career goal and what you want to achieve...' rows={3} {...register('description', { required: 'Description is required' })} />
                  {errors.description && <p className='text-sm text-destructive'>{errors.description.message}</p>}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='target_role'>Target Role</Label>
                  <Select onValueChange={(value) => setValue('target_role', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select target role' />
                    </SelectTrigger>
                    <SelectContent>
                      {popularRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='target_company'>Target Company (Optional)</Label>
                  <Input id='target_company' placeholder='e.g., Google, Microsoft, Startup' {...register('target_company')} />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='timeline'>Timeline</Label>
                  <Select onValueChange={(value) => setValue('timeline', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select timeline' />
                    </SelectTrigger>
                    <SelectContent>
                      {timelineOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='flex justify-end space-x-2 pt-4'>
                  <Button type='button' variant='outline' onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type='submit'>{editingGoal ? 'Update Goal' : 'Add Goal'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <Card className='bg-gradient-card shadow-skill-card'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Active Goals</CardTitle>
              <Target className='h-4 w-4 text-primary' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{goals.length}</div>
              <p className='text-xs text-muted-foreground'>Career objectives in progress</p>
            </CardContent>
          </Card>

          <Card className='bg-gradient-card shadow-skill-card'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Average Progress</CardTitle>
              <TrendingUp className='h-4 w-4 text-success' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {goals.length > 0 ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length) : 0}%
              </div>
              <Progress value={goals.length > 0 ? goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length : 0} className='mt-2' />
            </CardContent>
          </Card>

          <Card className='bg-gradient-card shadow-skill-card'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Near Completion</CardTitle>
              <Badge className='bg-success text-success-foreground'>{goals.filter((g) => g.progress >= 80).length}</Badge>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{goals.filter((g) => g.progress >= 80).length}</div>
              <p className='text-xs text-muted-foreground'>Goals 80%+ complete</p>
            </CardContent>
          </Card>
        </div>

        {goals.length > 0 ? (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {goals.map((goal) => (
              <Card key={goal.id} className='bg-gradient-card shadow-skill-card hover:shadow-hover transition-smooth'>
                <CardHeader>
                  <div className='flex items-start justify-between'>
                    <div className='space-y-1'>
                      <CardTitle className='text-xl'>{goal.title}</CardTitle>
                      <div className='flex items-center space-x-2 text-sm text-muted-foreground'>
                        <Building className='h-3 w-3' />
                        <span>{goal.target_company || 'Any Company'}</span>
                        <Calendar className='h-3 w-3 ml-2' />
                        <span>{goal.timeline}</span>
                      </div>
                    </div>
                    <div className='flex space-x-1'>
                      <Button variant='ghost' size='sm' onClick={() => handleEdit(goal)}>
                        <Edit className='h-4 w-4' />
                      </Button>
                      <Button variant='ghost' size='sm' onClick={() => handleDelete(goal.id)}>
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className='space-y-4'>
                  <p className='text-muted-foreground'>{goal.description}</p>

                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>Progress</span>
                      <div className='flex items-center space-x-2'>
                        <Badge className={`${getStatusColor(goal.progress)} text-white`}>{getStatusText(goal.progress)}</Badge>
                        <span className='text-sm font-medium'>{goal.progress}%</span>
                      </div>
                    </div>
                    <Progress value={goal.progress} className='h-2' />
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <h4 className='text-sm font-medium mb-2 text-success'>Completed Skills</h4>
                      <div className='flex flex-wrap gap-1'>
                        {goal.skills_completed.map((skill, index) => (
                          <Badge key={index} variant='secondary' className='text-xs'>
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className='text-sm font-medium mb-2 text-warning'>Skills Needed</h4>
                      <div className='flex flex-wrap gap-1'>
                        {goal.skills_needed.map((skill, index) => (
                          <Badge key={index} variant='outline' className='text-xs'>
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className='pt-2 border-t'>
                    <Button className='w-full' variant='outline'>
                      <Target className='h-4 w-4 mr-2' />
                      Generate Learning Path
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className='text-center py-12'>
            <Target className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
            <h3 className='text-lg font-medium text-foreground mb-2'>No career goals yet</h3>
            <p className='text-muted-foreground mb-4'>Start by defining your first career objective</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className='h-4 w-4 mr-2' />
              Add Your First Goal
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CareerGoals

