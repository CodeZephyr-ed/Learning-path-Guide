import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { DashboardProvider } from '@/contexts/DashboardContext'
import { Navbar } from '@/components/layout/Navbar'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import Index from './pages/Index'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Skills from './pages/Skills'
import CareerGoals from './pages/CareerGoals'
import AISkillAnalysis from './pages/AISkillAnalysis'
import NotFound from './pages/NotFound'

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DashboardProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Navbar />
            <Routes>
            <Route path='/' element={<Index />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route
              path='/dashboard'
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path='/skills'
              element={
                <ProtectedRoute>
                  <Skills />
                </ProtectedRoute>
              }
            />
            <Route
              path='/career-goals'
              element={
                <ProtectedRoute>
                  <CareerGoals />
                </ProtectedRoute>
              }
            />
            <Route
              path='/ai-skill-analysis'
              element={
                <ProtectedRoute>
                  <AISkillAnalysis />
                </ProtectedRoute>
              }
            />
            <Route path='*' element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DashboardProvider>
    </AuthProvider>
  </QueryClientProvider>
)

export default App


