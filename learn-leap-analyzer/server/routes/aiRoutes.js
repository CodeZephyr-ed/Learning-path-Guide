const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const aiService = require('../services/aiService');
const UserSkills = require('../models/UserSkills');
const RoleRequirements = require('../models/RoleRequirements');

/**
 * @route   GET /api/ai/roles
 * @desc    Get all available roles
 * @access  Private
 */
router.get('/roles', protect, async (req, res) => {
  try {
    const roles = await RoleRequirements.find({ isActive: true })
      .select('role description experienceLevel averageSalary')
      .sort('role');
    
    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/ai/analyze
 * @desc    Analyze skill gap for a specific role
 * @access  Private
 */
router.post('/analyze', protect, async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.user.id;

    if (!role) {
      return res.status(400).json({ message: 'Role is required' });
    }

    // Get user skills
    const userSkills = await UserSkills.findOne({ userId });
    if (!userSkills) {
      return res.status(404).json({ message: 'User skills not found' });
    }

    // Get role requirements
    const roleRequirements = await RoleRequirements.findOne({ 
      normalizedRole: role.toLowerCase().replace(/[^a-z0-9]+/g, '-') 
    });

    if (!roleRequirements) {
      return res.status(404).json({ message: 'Role requirements not found' });
    }

    // Analyze skill gap
    const skillGap = await aiService.analyzeSkillGap(
      userSkills.skills,
      roleRequirements
    );

    // Save analysis results
    userSkills.lastAnalyzed = new Date();
    userSkills.analysisResults = {
      role: roleRequirements.role,
      roleId: roleRequirements._id,
      analysis: skillGap,
      date: new Date()
    };
    await userSkills.save();

    res.json({
      success: true,
      role: roleRequirements.role,
      analysis: skillGap
    });
  } catch (error) {
    console.error('Error in skill gap analysis:', error);
    res.status(500).json({ 
      message: 'Error performing skill gap analysis',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/ai/roadmap
 * @desc    Generate learning roadmap based on skill gap
 * @access  Private
 */
router.post('/roadmap', protect, async (req, res) => {
  try {
    const { role, preferences = {} } = req.body;
    const userId = req.user.id;

    if (!role) {
      return res.status(400).json({ message: 'Role is required' });
    }

    // Get user's latest analysis
    const userSkills = await UserSkills.findOne({ userId });
    if (!userSkills?.analysisResults) {
      return res.status(400).json({ 
        message: 'Please complete skill gap analysis first' 
      });
    }

    // Generate learning roadmap
    const roadmap = await aiService.generateLearningRoadmap(
      userSkills.analysisResults.analysis,
      {
        ...preferences,
        learningStyle: preferences.learningStyle || userSkills.preferredLearningStyle
      }
    );

    // Save roadmap to user's skills
    if (!userSkills.learningRoadmaps) {
      userSkills.learningRoadmaps = [];
    }

    userSkills.learningRoadmaps.push({
      id: roadmap.id,
      role,
      generatedAt: roadmap.generatedAt,
      preferences: {
        learningStyle: preferences.learningStyle || userSkills.preferredLearningStyle,
        timeCommitment: preferences.timeCommitment || 'medium'
      },
      isActive: true
    });

    await userSkills.save();

    res.json({
      success: true,
      roadmap
    });
  } catch (error) {
    console.error('Error generating roadmap:', error);
    res.status(500).json({ 
      message: 'Error generating learning roadmap',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/ai/roadmap/:id
 * @desc    Get a specific learning roadmap
 * @access  Private
 */
router.get('/roadmap/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const userSkills = await UserSkills.findOne({ 
      userId,
      'learningRoadmaps.id': id 
    });

    if (!userSkills) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    const roadmap = userSkills.learningRoadmaps.find(r => r.id === id);
    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    res.json({
      success: true,
      roadmap
    });
  } catch (error) {
    console.error('Error fetching roadmap:', error);
    res.status(500).json({ 
      message: 'Error fetching learning roadmap',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/ai/roadmap
 * @desc    Get all learning roadmaps for the user
 * @access  Private
 */
router.get('/roadmap', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const userSkills = await UserSkills.findOne({ userId });

    if (!userSkills?.learningRoadmaps?.length) {
      return res.json({
        success: true,
        roadmaps: []
      });
    }

    res.json({
      success: true,
      roadmaps: userSkills.learningRoadmaps
    });
  } catch (error) {
    console.error('Error fetching roadmaps:', error);
    res.status(500).json({ 
      message: 'Error fetching learning roadmaps',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
