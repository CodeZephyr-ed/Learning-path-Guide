import mongoose from 'mongoose'

const skillSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    name: { type: String, required: true, index: true },
    category: { type: String, required: true },
    proficiency: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'], required: true },
  },
  { timestamps: true }
)

export default mongoose.model('Skill', skillSchema)


