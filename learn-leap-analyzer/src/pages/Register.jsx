import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Eye, EyeOff } from 'lucide-react'

export const Register = () => {
  const { user, signUp } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('password')

  if (user) return <Navigate to='/dashboard' replace />

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      await signUp(data.email, data.password, data.fullName)
    } catch (error) {
      console.error('Registration error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-hero flex items-center justify-center px-4'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <div className='w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-4'>
            <BarChart3 className='h-8 w-8 text-white' />
          </div>
          <h1 className='text-3xl font-bold text-white mb-2'>Join SkillPath</h1>
          <p className='text-white/80'>Start your personalized learning journey</p>
        </div>

        <Card className='bg-white/10 backdrop-blur-md border-white/20'>
          <CardHeader className='text-center'>
            <CardTitle className='text-white'>Create your account</CardTitle>
            <CardDescription className='text-white/70'>Sign up to get personalized skill recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='fullName' className='text-white'>Full Name</Label>
                <Input
                  id='fullName'
                  type='text'
                  placeholder='Your full name'
                  className='bg-white/10 border-white/20 text-white placeholder:text-white/50'
                  {...register('fullName', { required: 'Full name is required', minLength: { value: 2, message: 'Name must be at least 2 characters' } })}
                />
                {errors.fullName && <p className='text-red-300 text-sm'>{errors.fullName.message}</p>}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='email' className='text-white'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='your.email@example.com'
                  className='bg-white/10 border-white/20 text-white placeholder:text-white/50'
                  {...register('email', { required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' } })}
                />
                {errors.email && <p className='text-red-300 text-sm'>{errors.email.message}</p>}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='password' className='text-white'>Password</Label>
                <div className='relative'>
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Create a secure password'
                    className='bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-10'
                    {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                  />
                  <Button type='button' variant='ghost' size='sm' className='absolute right-0 top-0 h-full px-3 text-white/70 hover:text-white hover:bg-transparent' onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                  </Button>
                </div>
                {errors.password && <p className='text-red-300 text-sm'>{errors.password.message}</p>}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='confirmPassword' className='text-white'>Confirm Password</Label>
                <Input
                  id='confirmPassword'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Confirm your password'
                  className='bg-white/10 border-white/20 text-white placeholder:text-white/50'
                  {...register('confirmPassword', { required: 'Please confirm your password', validate: (value) => value === password || 'Passwords do not match' })}
                />
                {errors.confirmPassword && <p className='text-red-300 text-sm'>{errors.confirmPassword.message}</p>}
              </div>

              <Button type='submit' className='w-full bg-white text-primary hover:bg-white/90 transition-smooth' disabled={loading}>
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
            </form>

            <div className='mt-6 text-center'>
              <p className='text-white/70'>
                Already have an account?{' '}
                <Link to='/login' className='text-white font-medium hover:underline'>
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Register


