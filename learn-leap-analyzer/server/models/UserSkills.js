const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  proficiency: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 1
  },
  lastUsed: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const userSkillsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  skills: [skillSchema],
  learningGoals: [{
    type: String,
    trim: true
  }],
  preferredLearningStyle: {
    type: String,
    enum: ['visual', 'hands-on', 'theoretical', 'mixed'],
    default: 'mixed'
  },
  lastAnalyzed: {
    type: Date
  },
  analysisResults: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for faster queries
userSkillsSchema.index({ userId: 1, 'skills.name': 1 }, { unique: true });

// Static method to get skills by user ID
userSkillsSchema.statics.findByUserId = async function(userId) {
  return this.findOne({ userId }).populate('userId', 'name email');
};

// Instance method to add a new skill
userSkillsSchema.methods.addSkill = async function(skillData) {
  const existingSkillIndex = this.skills.findIndex(
    s => s.name.toLowerCase() === skillData.name.toLowerCase()
  );

  if (existingSkillIndex >= 0) {
    // Update existing skill
    this.skills[existingSkillIndex] = {
      ...this.skills[existingSkillIndex].toObject(),
      ...skillData,
      lastUsed: Date.now()
    };
  } else {
    // Add new skill
    this.skills.push({
      ...skillData,
      lastUsed: skillData.lastUsed || Date.now()
    });
  }

  return this.save();
};

// Instance method to remove a skill
userSkillsSchema.methods.removeSkill = function(skillName) {
  this.skills = this.skills.filter(
    s => s.name.toLowerCase() !== skillName.toLowerCase()
  );
  return this.save();
};

const UserSkills = mongoose.model('UserSkills', userSkillsSchema);

module.exports = UserSkills;
