import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import LearningResource from '../models/LearningResource.js'

const router = Router()

router.get('/recommend', requireAuth, async (req, res) => {
  const { skill, difficulty } = req.query
  const q = {}
  if (skill) q.skills = skill
  if (difficulty) q.difficulty = difficulty
  const items = await LearningResource.find(q).limit(20).lean()
  res.json(items)
})

router.get('/:id', requireAuth, async (req, res) => {
  const item = await LearningResource.findById(req.params.id).lean()
  if (!item) return res.status(404).json({ message: 'Not found' })
  res.json(item)
})

router.get('/all/skills', async (_req, res) => {
  const skills = await LearningResource.distinct('skills')
  res.json(skills)
})

export default router


