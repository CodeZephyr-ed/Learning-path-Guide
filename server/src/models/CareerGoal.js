import mongoose from 'mongoose'

const CareerGoalSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    target_role: { type: String, required: true },
    target_company: { type: String },
    timeline: { type: String },
    progress: { type: Number, default: 0 },
    skills_needed: [{ type: String }],
    skills_completed: [{ type: String }],
  },
  { timestamps: true },
)

export default mongoose.model('CareerGoal', CareerGoalSchema)
