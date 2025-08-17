import React, { createContext, useContext, useState, useCallback } from 'react'
import { api } from '@/lib/api'

const DashboardContext = createContext(undefined)

export const useDashboard = () => {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider')
  }
  return context
}

export const DashboardProvider = ({ children }) => {
  const [skills, setSkills] = useState([])
  const [goals, setGoals] = useState([])
  const [lastUpdated, setLastUpdated] = useState(Date.now())

  const refreshData = useCallback(async () => {
    try {
      const [skillsResponse, goalsResponse] = await Promise.all([
        api.get('/users/skills').catch(() => ({ data: [] })),
        api.get('/career-goals').catch(() => ({ data: [] }))
      ])
      
      setSkills(skillsResponse.data)
      setGoals(goalsResponse.data)
      setLastUpdated(Date.now())
      
      return {
        skills: skillsResponse.data,
        goals: goalsResponse.data
      }
    } catch (error) {
      console.error('Failed to refresh dashboard data:', error)
      return { skills: [], goals: [] }
    }
  }, [])

  const updateSkills = useCallback((newSkills) => {
    setSkills(newSkills)
    setLastUpdated(Date.now())
  }, [])

  const updateGoals = useCallback((newGoals) => {
    setGoals(newGoals)
    setLastUpdated(Date.now())
  }, [])

  const addSkill = useCallback((skill) => {
    setSkills(prev => [...prev, skill])
    setLastUpdated(Date.now())
  }, [])

  const updateSkill = useCallback((skillId, updatedSkill) => {
    setSkills(prev => prev.map(skill => 
      skill._id === skillId ? updatedSkill : skill
    ))
    setLastUpdated(Date.now())
  }, [])

  const removeSkill = useCallback((skillId) => {
    setSkills(prev => prev.filter(skill => skill._id !== skillId))
    setLastUpdated(Date.now())
  }, [])

  const addGoal = useCallback((goal) => {
    setGoals(prev => [...prev, goal])
    setLastUpdated(Date.now())
  }, [])

  const updateGoal = useCallback((goalId, updatedGoal) => {
    setGoals(prev => prev.map(goal => 
      goal._id === goalId ? updatedGoal : goal
    ))
    setLastUpdated(Date.now())
  }, [])

  const removeGoal = useCallback((goalId) => {
    setGoals(prev => prev.filter(goal => goal._id !== goalId))
    setLastUpdated(Date.now())
  }, [])

  const value = {
    skills,
    goals,
    lastUpdated,
    refreshData,
    updateSkills,
    updateGoals,
    addSkill,
    updateSkill,
    removeSkill,
    addGoal,
    updateGoal,
    removeGoal
  }

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}

export default DashboardProvider
