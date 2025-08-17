import 'dotenv/config'
import mongoose from 'mongoose'
import LearningResource from '../models/LearningResource.js'

const resources = [
  { title: 'React Official Docs', provider: 'React', url: 'https://react.dev', skills: ['React'], difficulty: 'beginner', type: 'docs' },
  { title: 'Node.js Guide', provider: 'Node.js', url: 'https://nodejs.org/en/learn', skills: ['Node.js'], difficulty: 'beginner', type: 'docs' },
  { title: 'MongoDB University - Basics', provider: 'MongoDB', url: 'https://learn.mongodb.com', skills: ['MongoDB'], difficulty: 'beginner', type: 'course' },
  { title: 'Docker for Beginners', provider: 'Docker', url: 'https://www.docker.com/resources/what-container', skills: ['Docker'], difficulty: 'beginner', type: 'article' },
]

async function main() {
  await mongoose.connect(process.env.MONGO_URI)
  await LearningResource.deleteMany({})
  await LearningResource.insertMany(resources)
  console.log('Seeded resources:', resources.length)
  await mongoose.disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


