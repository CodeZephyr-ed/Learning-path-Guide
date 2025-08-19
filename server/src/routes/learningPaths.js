import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import LearningPath from '../models/LearningPath.js'
import LearningResource from '../models/LearningResource.js'
import { generateLearningRoadmap } from '../services/gemini.js'

const router = Router()

router.post('/generate-ai', requireAuth, async (req, res) => {
  const { targetRole, skillGaps } = req.body
  if (!targetRole || !skillGaps) {
    return res.status(400).json({ message: 'targetRole and skillGaps are required' })
  }

  try {
    const roadmap = await generateLearningRoadmap(targetRole, skillGaps)
    res.json(roadmap)
  } catch (error) {
    console.error('Error generating AI learning roadmap:', error)
    res.status(500).json({ message: 'Failed to generate learning roadmap' })
  }
})

router.post('/generate', requireAuth, async (req, res) => {
  const { title, targetRole, gaps = [] } = req.body
  const steps = await Promise.all(
    gaps.map(async (skill) => {
      const resource = await LearningResource.findOne({ skills: skill }).lean()
      return {
        title: `Learn ${skill}`,
        description: `Study ${skill} basics and practice projects`,
        resourceId: resource?._id,
        status: 'not_started',
      }
    })
  )
  const lp = await LearningPath.create({ userId: req.user.id, title, targetRole, steps, progress: 0 })
  res.status(201).json(lp)
})

router.get('/', requireAuth, async (req, res) => {
  const items = await LearningPath.find({ userId: req.user.id }).lean()
  res.json(items)
})

router.get('/:id', requireAuth, async (req, res) => {
  const lp = await LearningPath.findOne({ _id: req.params.id, userId: req.user.id }).lean()
  if (!lp) return res.status(404).json({ message: 'Not found' })
  res.json(lp)
})

router.put('/:id/progress', requireAuth, async (req, res) => {
  const { stepIndex, status } = req.body
  const lp = await LearningPath.findOne({ _id: req.params.id, userId: req.user.id })
  if (!lp) return res.status(404).json({ message: 'Not found' })
  if (typeof stepIndex === 'number' && lp.steps[stepIndex]) {
    lp.steps[stepIndex].status = status
  }
  const finished = lp.steps.filter((s) => s.status === 'completed').length
  lp.progress = lp.steps.length ? Math.round((finished / lp.steps.length) * 100) : 0
  await lp.save()
  res.json(lp)
})

export default router


