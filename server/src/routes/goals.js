import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import CareerGoal from '../models/CareerGoal.js'

const router = Router()

// Get all career goals for the authenticated user
router.get('/', requireAuth, async (req, res) => {
  try {
    const goals = await CareerGoal.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean()
    res.json(goals)
  } catch (error) {
    console.error('Error fetching career goals:', error)
    res.status(500).json({ message: 'Failed to fetch career goals' })
  }
})

// Create a new career goal
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, description } = req.body
    if (!title) {
      return res.status(400).json({ message: 'Title is required' })
    }
    const goal = await CareerGoal.create({ 
      userId: req.user.id, 
      title, 
      description: description || '' 
    })
    res.status(201).json(goal)
  } catch (error) {
    console.error('Error creating career goal:', error)
    res.status(500).json({ message: 'Failed to create career goal' })
  }
})

// Update a career goal
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const { title, description } = req.body
    
    const updatedGoal = await CareerGoal.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { title, description },
      { new: true, runValidators: true }
    )
    
    if (!updatedGoal) {
      return res.status(404).json({ message: 'Career goal not found' })
    }
    
    res.json(updatedGoal)
  } catch (error) {
    console.error('Error updating career goal:', error)
    res.status(500).json({ message: 'Failed to update career goal' })
  }
})

// Delete a career goal
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const deletedGoal = await CareerGoal.findOneAndDelete({ 
      _id: id, 
      userId: req.user.id 
    })
    
    if (!deletedGoal) {
      return res.status(404).json({ message: 'Career goal not found' })
    }
    
    res.json({ message: 'Career goal deleted successfully' })
  } catch (error) {
    console.error('Error deleting career goal:', error)
    res.status(500).json({ message: 'Failed to delete career goal' })
  }
})

export default router


