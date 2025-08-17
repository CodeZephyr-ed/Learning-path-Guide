const natural = require('natural');
const { Configuration, OpenAIApi } = require('openai');
const { v4: uuidv4 } = require('uuid');

// Initialize OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Initialize TF-IDF
const TfIdf = natural.TfIdf;
const tfidf = new TfIdf();

/**
 * Calculate similarity between skills using TF-IDF
 * @param {string} skill1 - First skill
 * @param {string} skill2 - Second skill
 * @returns {number} Similarity score (0-1)
 */
const calculateSkillSimilarity = (skill1, skill2) => {
  const tokens1 = skill1.toLowerCase().split(/[\s\-&,]+/);
  const tokens2 = skill2.toLowerCase().split(/[\s\-&,]+/);
  
  // Simple Jaccard similarity for short strings
  const set1 = new Set(tokens1);
  const set2 = new Set(tokens2);
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return union.size > 0 ? intersection.size / union.size : 0;
};

/**
 * Analyze skill gap between user skills and target role requirements
 * @param {Array} userSkills - Array of user's skills
 * @param {Object} targetRole - Target role requirements
 * @returns {Object} Skill gap analysis
 */
const analyzeSkillGap = async (userSkills, targetRole) => {
  const requiredSkills = targetRole.requiredSkills || [];
  const userSkillMap = new Map(userSkills.map(skill => [skill.name.toLowerCase(), skill]));
  
  const matchedSkills = [];
  const missingSkills = [];
  const partialMatches = [];
  
  // Check each required skill against user skills
  for (const reqSkill of requiredSkills) {
    const reqSkillName = reqSkill.name.toLowerCase();
    let bestMatch = null;
    let highestSimilarity = 0;
    
    // Find best matching user skill
    for (const [userSkillName, userSkill] of userSkillMap.entries()) {
      const similarity = calculateSkillSimilarity(reqSkillName, userSkillName);
      if (similarity > highestSimilarity) {
        highestSimilarity = similarity;
        bestMatch = { ...userSkill, similarity };
      }
    }
    
    // Categorize the match
    if (bestMatch && highestSimilarity > 0.7) {
      matchedSkills.push({
        requiredSkill: reqSkill,
        userSkill: bestMatch,
        matchScore: highestSimilarity,
        status: 'matched'
      });
    } else if (bestMatch && highestSimilarity > 0.3) {
      partialMatches.push({
        requiredSkill: reqSkill,
        userSkill: bestMatch,
        matchScore: highestSimilarity,
        status: 'partial'
      });
    } else {
      missingSkills.push({
        requiredSkill: reqSkill,
        status: 'missing'
      });
    }
  }
  
  // Calculate overall match percentage
  const totalSkills = requiredSkills.length || 1;
  const matchPercentage = Math.round((matchedSkills.length / totalSkills) * 100);
  
  return {
    matchedSkills,
    partialMatches,
    missingSkills,
    matchPercentage,
    totalRequiredSkills: requiredSkills.length,
    matchedCount: matchedSkills.length,
    partialMatchCount: partialMatches.length,
    missingCount: missingSkills.length,
    timestamp: new Date().toISOString()
  };
};

/**
 * Generate personalized learning roadmap using OpenAI
 * @param {Object} skillGap - Result from analyzeSkillGap
 * @param {Object} userPreferences - User preferences
 * @returns {Object} Learning roadmap
 */
const generateLearningRoadmap = async (skillGap, userPreferences = {}) => {
  try {
    const { learningStyle = 'visual', timeCommitment = 'medium' } = userPreferences;
    const timeFrames = {
      low: '1-2 hours per week',
      medium: '5-7 hours per week',
      high: '10+ hours per week'
    };
    
    const prompt = `Create a personalized learning roadmap with the following details:
    - Target Role: ${skillGap.targetRole || 'Software Developer'}
    - Missing Skills: ${skillGap.missingSkills.map(s => s.requiredSkill.name).join(', ')}
    - Partial Matches: ${skillGap.partialMatches.map(s => s.requiredSkill.name).join(', ')}
    - Learning Style: ${learningStyle}
    - Time Commitment: ${timeFrames[timeCommitment] || timeFrames.medium}
    
    Provide a structured learning path with:
    1. Skill categories to focus on
    2. Recommended learning resources (free/paid)
    3. Estimated time per skill
    4. Project ideas to practice skills
    5. Milestones to track progress`;
    
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful career advisor that creates personalized learning roadmaps. Provide clear, actionable steps with specific resource recommendations when possible."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });
    
    return {
      id: uuidv4(),
      generatedAt: new Date().toISOString(),
      roadmap: response.data.choices[0].message.content,
      metadata: {
        model: 'gpt-3.5-turbo',
        prompt_tokens: response.data.usage?.prompt_tokens,
        completion_tokens: response.data.usage?.completion_tokens
      }
    };
  } catch (error) {
    console.error('Error generating roadmap:', error);
    throw new Error('Failed to generate learning roadmap');
  }
};

/**
 * Get standard requirements for a role
 * @param {string} role - Role name
 * @returns {Object} Role requirements
 */
const getRoleRequirements = async (role) => {
  // This would typically come from a database
  // For now, we'll use a simplified in-memory dataset
  const roleTemplates = {
    'frontend-developer': {
      role: 'Frontend Developer',
      requiredSkills: [
        { name: 'HTML5', category: 'Web Development', importance: 5 },
        { name: 'CSS3', category: 'Web Development', importance: 5 },
        { name: 'JavaScript', category: 'Programming', importance: 5 },
        { name: 'React', category: 'Frontend Framework', importance: 5 },
        { name: 'Responsive Design', category: 'UI/UX', importance: 4 },
        { name: 'Git', category: 'Version Control', importance: 4 },
        { name: 'RESTful APIs', category: 'Backend', importance: 3 },
        { name: 'TypeScript', category: 'Programming', importance: 3 },
        { name: 'Testing (Jest/React Testing Library)', category: 'Testing', importance: 3 },
        { name: 'Webpack', category: 'Build Tools', importance: 2 }
      ],
      industryStandards: [
        'Progressive Web Apps (PWA)',
        'Web Content Accessibility Guidelines (WCAG)',
        'Cross-browser compatibility'
      ]
    },
    // Add more roles as needed
  };
  
  const normalizedRole = role.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return roleTemplates[normalizedRole] || roleTemplates['frontend-developer'];
};

module.exports = {
  analyzeSkillGap,
  generateLearningRoadmap,
  getRoleRequirements,
  calculateSkillSimilarity
};
