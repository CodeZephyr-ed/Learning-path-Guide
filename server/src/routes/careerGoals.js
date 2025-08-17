import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import CareerGoal from '../models/CareerGoal.js' // Create this Mongoose model

const router = Router()

// Get all career goals for the authenticated user
router.get('/', requireAuth, async (req, res) => {
  try {
    const goals = await CareerGoal.find({ userId: req.user.id }).lean()
    res.json(goals)
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching career goals' })
  }
})

// Create a new career goal
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, description } = req.body
    const goal = await CareerGoal.create({ userId: req.user.id, title, description })
    res.status(201).json(goal)
  } catch (error) {
    res.status(500).json({ message: 'Server error creating career goal' })
  }
})

export default router
