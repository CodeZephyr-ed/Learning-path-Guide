import { Router } from 'express';
import LearningResource from '../models/LearningResource.js';
import Skill from '../models/Skill.js';

const router = Router();

// GET /api/skills/all
router.get('/all', async (_req, res) => {
  const fromResources = await LearningResource.distinct('skills');
  const fromUserSkills = await Skill.distinct('name');
  const set = new Set([...(fromResources || []), ...(fromUserSkills || [])]);
  res.json(Array.from(set).sort());
});

export default router;
