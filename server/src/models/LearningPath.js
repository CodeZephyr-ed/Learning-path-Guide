import mongoose from 'mongoose'

const moduleSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    resourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'LearningResource' },
    status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
  },
  { _id: false }
)

const learningPathSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    title: { type: String, required: true },
    targetRole: { type: String, required: true },
    steps: [moduleSchema],
    progress: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model('LearningPath', learningPathSchema)


