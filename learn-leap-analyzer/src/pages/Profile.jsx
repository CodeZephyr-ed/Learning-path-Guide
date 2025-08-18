import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, User, Trash2, LogOut } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export const Profile = () => {
  const { user, signOut, deleteAccount } = useAuth()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true)
      return
    }

    try {
      setIsDeleting(true)
      await deleteAccount()
      toast({
        title: 'Account Deleted',
        description: 'Your account has been successfully deleted.',
      })
      navigate('/')
    } catch (error) {
      console.error('Failed to delete account:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete account. Please try again.',
        variant: 'destructive',
      })
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  if (!user) {
    navigate('/login')
    return null
  }

  const fullName = user.user_metadata?.full_name || 'User'
  const email = user.email || 'No email'
  const avatarUrl = user.user_metadata?.avatar_url
  const avatarFallback = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className='min-h-screen bg-background'>
      <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='space-y-8'>
          <div className='space-y-2'>
            <h1 className='text-3xl font-bold tracking-tight'>Profile</h1>
            <p className='text-muted-foreground'>Manage your account settings</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your profile information and account settings</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='flex items-center space-x-6'>
                <Avatar className='h-20 w-20'>
                  {avatarUrl && <AvatarImage src={avatarUrl} alt={fullName} />}
                  <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className='text-lg font-medium'>{fullName}</h3>
                  <p className='text-muted-foreground'>{email}</p>
                </div>
              </div>

              <div className='space-y-4 pt-4'>
                <div>
                  <h4 className='text-sm font-medium mb-2'>Account Actions</h4>
                  <div className='space-y-3'>
                    <Button variant='outline' className='w-full justify-start' onClick={handleSignOut}>
                      <LogOut className='mr-2 h-4 w-4' />
                      Sign Out
                    </Button>
                    
                    {!showDeleteConfirm ? (
                      <Button 
                        variant='destructive' 
                        className='w-full justify-start'
                        onClick={() => setShowDeleteConfirm(true)}
                      >
                        <Trash2 className='mr-2 h-4 w-4' />
                        Delete Account
                      </Button>
                    ) : (
                      <Alert variant='destructive' className='border-destructive'>
                        <AlertCircle className='h-4 w-4' />
                        <AlertTitle>Are you sure?</AlertTitle>
                        <AlertDescription className='mt-2'>
                          This action cannot be undone. This will permanently delete your account and all associated data.
                        </AlertDescription>
                        <div className='flex space-x-2 mt-4'>
                          <Button 
                            variant='outline' 
                            size='sm' 
                            onClick={() => setShowDeleteConfirm(false)}
                            disabled={isDeleting}
                          >
                            Cancel
                          </Button>
                          <Button 
                            variant='destructive' 
                            size='sm' 
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                          >
                            {isDeleting ? 'Deleting...' : 'Delete My Account'}
                          </Button>
                        </div>
                      </Alert>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Profile
