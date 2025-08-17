import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import Skill from '../models/Skill.js'

const router = Router()

router.get('/', requireAuth, async (req, res) => {
  const { targetRole } = req.query
  const userSkills = await Skill.find({ userId: req.user.id }).lean()
  const have = new Set(userSkills.map((s) => s.name.toLowerCase()))
  const roleRequirements = (targetRole || '').toLowerCase().includes('devops')
    ? ['Docker', 'Kubernetes', 'Terraform']
    : ['React', 'Node.js', 'MongoDB']
  const gaps = roleRequirements.filter((r) => !have.has(r.toLowerCase()))
  res.json({ targetRole: targetRole || 'Unknown', gaps })
})

export default router


