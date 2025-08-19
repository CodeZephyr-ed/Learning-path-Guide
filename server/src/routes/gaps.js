import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import Skill from '../models/Skill.js'
import { getSkillsForRole } from '../services/gemini.js'
import natural from 'natural'

const router = Router()

router.get('/', requireAuth, async (req, res) => {
  const { targetRole } = req.query
  if (!targetRole) {
    return res.status(400).json({ message: 'targetRole query parameter is required' })
  }

  try {
    const userSkills = await Skill.find({ userId: req.user.id }).lean()
    const requiredSkills = await getSkillsForRole(targetRole)

    const matchedSkills = []
    const partialSkills = []
    const missingSkills = []

    const userSkillNames = userSkills.map(s => s.name.toLowerCase())

    requiredSkills.forEach(reqSkill => {
      const reqSkillLower = reqSkill.toLowerCase()
      let bestMatch = { score: 0, skill: null }

      userSkillNames.forEach(userSkill => {
        const score = natural.JaroWinklerDistance(reqSkillLower, userSkill, { ignoreCase: true })
        if (score > bestMatch.score) {
          bestMatch = { score, skill: userSkill }
        }
      })

      if (bestMatch.score >= 0.95) {
        matchedSkills.push({ name: reqSkill, userSkill: bestMatch.skill })
      } else if (bestMatch.score >= 0.8) {
        partialSkills.push({ name: reqSkill, userSkill: bestMatch.skill, matchScore: bestMatch.score })
      } else {
        missingSkills.push({ name: reqSkill })
      }
    })

    const totalSkills = requiredSkills.length
    const matchedCount = matchedSkills.length
    const partialMatchCount = partialSkills.length
    const missingCount = missingSkills.length
    const matchPercentage = totalSkills > 0 ? Math.round(((matchedCount + partialMatchCount * 0.5) / totalSkills) * 100) : 0

    res.json({
      targetRole,
      matchedSkills,
      partialSkills,
      missingSkills,
      matchedCount,
      partialMatchCount,
      missingCount,
      matchPercentage,
    })
  } catch (error) {
    console.error('Error getting skill gap analysis:', error)
    res.status(500).json({ message: 'Failed to perform skill gap analysis' })
  }
})

export default router


