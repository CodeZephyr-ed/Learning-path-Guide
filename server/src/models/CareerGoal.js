import mongoose from 'mongoose'

const CareerGoalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model('CareerGoal', CareerGoalSchema)
