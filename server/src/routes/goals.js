import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import LearningPath from '../models/LearningPath.js'

const router = Router()

router.get('/', requireAuth, async (req, res) => {
  const paths = await LearningPath.find({ userId: req.user.id }).lean()
  res.json(paths)
})

router.post('/', requireAuth, async (req, res) => {
  const { title, targetRole } = req.body
  const path = await LearningPath.create({ userId: req.user.id, title, targetRole, steps: [] })
  res.status(201).json(path)
})

export default router


