import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import CareerGoal from '../models/CareerGoal.js'

const router = Router()

// Get all career goals for the authenticated user
router.get('/', requireAuth, async (req, res) => {
  try {
    const goals = await CareerGoal.find({ user_id: req.user.id }).sort({ createdAt: -1 }).lean()
    res.json(goals)
  } catch (error) {
    console.error('Error fetching career goals:', error)
    res.status(500).json({ message: 'Failed to fetch career goals' })
  }
})

// Create a new career goal
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, description, target_role, target_company, timeline } = req.body
    if (!title || !description || !target_role) {
      return res.status(400).json({ message: 'Title, description, and target role are required' })
    }
    const goal = await CareerGoal.create({ 
      ...req.body,
      user_id: req.user.id,
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
    const updateData = { ...req.body }

    const updatedGoal = await CareerGoal.findOneAndUpdate(
      { _id: id, user_id: req.user.id },
      updateData,
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
      user_id: req.user.id 
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


