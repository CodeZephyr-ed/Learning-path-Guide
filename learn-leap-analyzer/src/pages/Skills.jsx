import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { SkillBadge } from '@/components/ui/skill-badge'
import { Progress } from '@/components/ui/progress'
import { Plus, Search, Trophy, TrendingUp, Edit, Trash2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useDashboard } from '@/contexts/DashboardContext'
import { api } from '@/lib/api'

const categories = ['Frontend', 'Backend', 'Database', 'DevOps', 'Cloud', 'Mobile', 'Programming Languages', 'Design', 'Data Science', 'Machine Learning']

const proficiencyLevels = [
  { value: 'beginner', label: 'Beginner', percentage: 25 },
  { value: 'intermediate', label: 'Intermediate', percentage: 50 },
  { value: 'advanced', label: 'Advanced', percentage: 75 },
  { value: 'expert', label: 'Expert', percentage: 100 },
]

export const Skills = () => {
  const { user } = useAuth()
  const { skills, refreshData, addSkill, updateSkill, removeSkill } = useDashboard()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState(null)
  const [loading, setLoading] = useState(true)

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      category: '',
      proficiency: ''
    }
  })

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch =
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const skillsByCategory = categories.reduce((acc, category) => {
    const categorySkills = filteredSkills.filter((skill) => skill.category === category)
    if (categorySkills.length > 0) {
      acc[category] = categorySkills
    }
    return acc
  }, {})

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        await refreshData()
      } catch (error) {
        console.error('Failed to load skills:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [refreshData])

  const onSubmit = async (data) => {
    try {
      if (editingSkill) {
        const { data: updated } = await api.put(`/users/skills/${editingSkill._id}`, data)
        updateSkill(editingSkill._id, updated)
      } else {
        const { data: created } = await api.post('/users/skills', data)
        addSkill(created)
      }
      closeDialog()
    } catch (error) {
      console.error('Failed to save skill:', error)
    }
  }

  const handleEdit = (skill) => {
    setEditingSkill(skill)
    reset({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) {
      return
    }
    try {
      await api.delete(`/users/skills/${id}`)
      removeSkill(id)
    } catch (error) {
      console.error('Failed to delete skill:', error)
    }
  }

  const getOverallProgress = () => {
    if (skills.length === 0) return 0
    const totalPercentage = skills.reduce((sum, skill) => {
      const level = proficiencyLevels.find((p) => p.value === skill.proficiency)
      return sum + (level?.percentage || 0)
    }, 0)
    return Math.round(totalPercentage / skills.length)
  }

const openNewSkillDialog = () => {
  console.log('Add Skill button clicked');
  setEditingSkill(null);
  reset();
  setIsDialogOpen(true);
};

// Log state changes when dialog opens or editingSkill changes
useEffect(() => {
  if (isDialogOpen) {
    console.log('Dialog opened for adding new skill', { editingSkill, isDialogOpen });
  }
}, [editingSkill, isDialogOpen]);



  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingSkill(null)
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-foreground mb-2'>My Skills</h1>
            <p className='text-muted-foreground'>Manage your skills and track proficiency levels</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <Button onClick={openNewSkillDialog}>
                <Plus className='h-4 w-4 mr-2' />
                Add Skill
              </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingSkill ? 'Edit Skill' : 'Add New Skill'}</DialogTitle>
                <DialogDescription>
                  {editingSkill ? 'Update your skill information.' : 'Add a new skill to your profile.'}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='name'>Skill Name</Label>
                  <Input id='name' placeholder='e.g., React.js, Python' {...register('name', { required: 'Skill name is required' })} autoComplete="off" />
                  {errors.name && <p className='text-sm text-destructive'>{errors.name.message}</p>}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='category'>Category</Label>
                   <Controller
                    name="category"
                    control={control}
                    rules={{ required: "Category is required." }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        {/* ✅ FIX: Pass the name from the field object */}
                        <SelectTrigger id="category" name={field.name} autoComplete="off">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
                </div>
                
                <div className='space-y-2'>
                  <Label htmlFor='proficiency'>Proficiency Level</Label>
                  <Controller
                    name="proficiency"
                    control={control}
                    rules={{ required: "Proficiency level is required." }}
                    render={({ field }) => (
                     <Select onValueChange={field.onChange} value={field.value}>
                        {/* ✅ FIX: Pass the name from the field object */}
                        <SelectTrigger id="proficiency" name={field.name} autoComplete="off">
                          <SelectValue placeholder="Select proficiency level" />
                        </SelectTrigger>
                        <SelectContent>
                          {proficiencyLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.proficiency && <p className="text-sm text-destructive">{errors.proficiency.message}</p>}
                </div>

                <div className='flex justify-end space-x-2 pt-4'>
                  <Button type='button' variant='outline' onClick={closeDialog}>
                    Cancel
                  </Button>
                  <Button type='submit'>{editingSkill ? 'Update Skill' : 'Add Skill'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* ... Cards section remains the same ... */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <Card className='bg-gradient-card shadow-skill-card'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Skills</CardTitle>
              <Trophy className='h-4 w-4 text-primary' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{skills.length}</div>
              <p className='text-xs text-muted-foreground'>Across {new Set(skills.map((s) => s.category)).size} categories</p>
            </CardContent>
          </Card>
          <Card className='bg-gradient-card shadow-skill-card'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Average Proficiency</CardTitle>
              <TrendingUp className='h-4 w-4 text-success' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{getOverallProgress()}%</div>
              <Progress value={getOverallProgress()} className='mt-2' />
            </CardContent>
          </Card>
          <Card className='bg-gradient-card shadow-skill-card'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Expert Level</CardTitle>
              <Badge className='bg-success text-success-foreground'>{skills.filter((s) => s.proficiency === 'expert').length}</Badge>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{skills.filter((s) => s.proficiency === 'expert').length}</div>
              <p className='text-xs text-muted-foreground'>Skills at expert level</p>
            </CardContent>
          </Card>
        </div>
        
        <div className='flex flex-col sm:flex-row gap-4 mb-6'>
          <div className='relative flex-1'>
            <Label htmlFor="search-skills" className="sr-only">Search Skills</Label>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
            {/* ✅ FIX: Added a name attribute for semantic correctness */}
            <Input id="search-skills" name="search-skills" placeholder='Search skills...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='pl-10' />
          </div>
          <div>
            <Label htmlFor="category-filter" className="sr-only">Filter by Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              {/* ✅ FIX: Added a name attribute for semantic correctness */}
              <SelectTrigger id="category-filter" name="category-filter" className='w-full sm:w-48'>
                <SelectValue placeholder='All Categories' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ... Rest of the JSX remains the same ... */}
        <div className='space-y-8'>
          {Object.keys(skillsByCategory).map((category) => {
            const categorySkills = skillsByCategory[category]
            return (
              <div key={category} className='space-y-4'>
                <h2 className='text-xl font-semibold text-foreground flex items-center gap-2'>
                  {category}
                  <Badge variant='secondary'>{categorySkills.length}</Badge>
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {categorySkills.map((skill) => (
                    <Card key={skill._id} className='bg-gradient-card shadow-skill-card hover:shadow-hover transition-smooth'>
                      <CardHeader className='pb-3'>
                        <div className='flex items-center justify-between'>
                          <CardTitle className='text-lg'>{skill.name}</CardTitle>
                          <div className='flex space-x-1'>
                            <Button variant='ghost' size='sm' onClick={() => handleEdit(skill)}>
                              <Edit className='h-4 w-4' />
                            </Button>
                            <Button variant='ghost' size='sm' onClick={() => handleDelete(skill._id)}>
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className='space-y-3'>
                          <SkillBadge skill={skill.name} proficiency={skill. proficiency} className='justify-center' />
                          <div className='space-y-1'>
                            <div className='flex justify-between text-sm'>
                              <span>Proficiency</span>
                              <span>{proficiencyLevels.find((p) => p.value === skill.proficiency)?.percentage}%</span>
                            </div>
                            <Progress value={proficiencyLevels.find((p) => p.value === skill.proficiency)?.percentage} className='h-2' />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        {loading === false && filteredSkills.length === 0 && (
          <div className='text-center py-12'>
            <Trophy className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
            <h3 className='text-lg font-medium text-foreground mb-2'>No skills found</h3>
            <p className='text-muted-foreground mb-4'>
              {searchTerm || selectedCategory !== 'all' ? 'Try adjusting your filters or search terms' : 'Start by adding your first skill'}
            </p>
            <Button onClick={openNewSkillDialog}>
              <Plus className='h-4 w-4 mr-2' />
              Add Your First Skill
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Skills