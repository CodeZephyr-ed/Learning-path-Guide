import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Skeleton } from '@/components/ui/skeleton'

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className='min-h-screen bg-background'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='space-y-6'>
            <Skeleton className='h-8 w-1/3' />
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <Skeleton className='h-32' />
              <Skeleton className='h-32' />
              <Skeleton className='h-32' />
            </div>
            <Skeleton className='h-64' />
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to='/login' state={{ from: location }} replace />
  }

  return <>{children}</>
}


