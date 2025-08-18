import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useToast } from '@/components/ui/use-toast'

const AuthContext = createContext(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await api.get('/auth/profile')
        setUser(data)
      } catch (_) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const signUp = async (email, password, fullName) => {
    try {
      const { data } = await api.post('/auth/register', { email, password, fullName })
      setUser(data)
      toast({ title: 'Success!', description: 'Account created successfully.' })
    } catch (err) {
      const msg = err?.response?.data?.message || 'Registration failed'
      toast({ title: 'Error', description: msg, variant: 'destructive' })
      throw err
    }
  }

  const signIn = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password })
      setUser(data)
      toast({ title: 'Welcome back!', description: "You've been signed in successfully." })
    } catch (err) {
      const msg = err?.response?.data?.message || 'Login failed'
      toast({ title: 'Error', description: msg, variant: 'destructive' })
      throw err
    }
  }

  const signOut = async () => {
    try {
      await api.post('/auth/logout')
      setUser(null)
      toast({ title: 'Signed out', description: "You've been signed out successfully." })
    } catch (err) {
      const msg = err?.response?.data?.message || 'Logout failed'
      toast({ title: 'Error', description: msg, variant: 'destructive' })
      throw err
    }
  }

  const deleteAccount = async () => {
    try {
      await api.delete('/auth/account')
      setUser(null)
      toast({ 
        title: 'Account Deleted', 
        description: 'Your account and all associated data have been permanently deleted.' 
      })
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to delete account'
      toast({ title: 'Error', description: msg, variant: 'destructive' })
      throw err
    }
  }

  const value = { user, loading, signUp, signIn, signOut, deleteAccount }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


