import mongoose from 'mongoose'

const learningResourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    provider: { type: String },
    url: { type: String },
    skills: [{ type: String, index: true }],
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
    type: { type: String, enum: ['course', 'article', 'project', 'video', 'docs'], default: 'course' },
  },
  { timestamps: true }
)

export default mongoose.model('LearningResource', learningResourceSchema)


