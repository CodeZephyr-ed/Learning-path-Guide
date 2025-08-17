import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import Skill from '../models/Skill.js'

const router = Router()

router.get('/skills', requireAuth, async (req, res) => {
  const skills = await Skill.find({ userId: req.user.id }).lean()
  res.json(skills)
})

router.post('/skills', requireAuth, async (req, res) => {
  const { name, category, proficiency } = req.body
  const skill = await Skill.create({ userId: req.user.id, name, category, proficiency })
  res.status(201).json(skill)
})

router.put('/skills/:id', requireAuth, async (req, res) => {
  const { id } = req.params
  const { name, category, proficiency } = req.body
  const skill = await Skill.findOneAndUpdate(
    { _id: id, userId: req.user.id },
    { name, category, proficiency },
    { new: true }
  )
  if (!skill) return res.status(404).json({ message: 'Not found' })
  res.json(skill)
})

router.delete('/skills/:id', requireAuth, async (req, res) => {
  const { id } = req.params
  const deleted = await Skill.findOneAndDelete({ _id: id, userId: req.user.id })
  if (!deleted) return res.status(404).json({ message: 'Not found' })
  res.json({ ok: true })
})

export default router


