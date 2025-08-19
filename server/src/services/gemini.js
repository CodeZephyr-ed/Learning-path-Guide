import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

async function getSkillsForRole(role) {
  if (!role) {
    throw new Error('Role is required to get skills.')
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `List the top 10 most essential technical skills for a "${role}" role. Return the list as a simple JSON array of strings. For example: ["skill1", "skill2", "skill3"]. Do not include any other text or explanation, just the JSON array.`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = await response.text()

    // Clean the response to get only the JSON array part
    const jsonString = text.trim().replace(/```json|```/g, '')
    const skills = JSON.parse(jsonString)
    return skills
  } catch (error) {
    console.error('Error fetching skills from Gemini API:', error)
    // As a fallback, return a default list of skills
    return ['Communication', 'Teamwork', 'Problem-Solving']
  }
}

async function generateLearningRoadmap(targetRole, skillGaps) {
  if (!targetRole || !skillGaps || skillGaps.length === 0) {
    throw new Error('Target role and skill gaps are required to generate a roadmap.')
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `
    Create a structured learning roadmap for a user aiming for a "${targetRole}" role. 
    The user has the following skill gaps: ${skillGaps.join(', ')}.
    The roadmap should be broken down into logical steps or modules. 
    For each step, suggest a few specific topics to learn and recommend 1-2 types of learning resources (e.g., "Online courses on Coursera", "Official documentation", "YouTube tutorials").
    Return the roadmap as a JSON object with a single key "roadmap" which is an array of objects. 
    Each object in the array should have "step", "title", "topics" (an array of strings), and "resources" (an array of strings).
    Example format:
    {
      "roadmap": [
        {
          "step": 1,
          "title": "Foundations of JavaScript",
          "topics": ["ES6+ Features", "Asynchronous JavaScript", "DOM Manipulation"],
          "resources": ["FreeCodeCamp interactive tutorials", "MDN Web Docs"]
        }
      ]
    }
    Do not include any other text or explanation, just the JSON object.
  `

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = await response.text()

    const jsonString = text.trim().replace(/```json|```/g, '')
    const roadmap = JSON.parse(jsonString)
    return roadmap
  } catch (error) {
    console.error('Error generating learning roadmap from Gemini API:', error)
    return { roadmap: [{ step: 1, title: 'Error', topics: ['Could not generate roadmap'], resources: ['Please try again'] }] }
  }
}

export { getSkillsForRole, generateLearningRoadmap }
