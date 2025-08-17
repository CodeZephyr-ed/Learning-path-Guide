import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { LandingPage } from '@/components/LandingPage'

const Index = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-hero flex items-center justify-center'>
        <div className='text-white text-xl'>Loading...</div>
      </div>
    )
  }

  if (user) {
    return <Navigate to='/dashboard' replace />
  }

  return <LandingPage />
}

export default Index


