const mongoose = require('mongoose');

const requiredSkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  importance: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 3
  },
  description: {
    type: String,
    trim: true
  },
  relatedSkills: [{
    type: String,
    trim: true
  }],
  prerequisites: [{
    type: String,
    trim: true
  }]
});

const roleRequirementsSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  normalizedRole: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  requiredSkills: [requiredSkillSchema],
  industryStandards: [{
    type: String,
    trim: true
  }],
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'lead', 'principal'],
    default: 'mid'
  },
  averageSalary: {
    entry: Number,
    mid: Number,
    senior: Number,
    lead: Number,
    principal: Number
  },
  jobGrowth: {
    type: Number,
    min: -100,
    max: 100,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    version: {
      type: Number,
      default: 1
    },
    source: {
      type: String,
      enum: ['manual', 'api', 'ai-generated'],
      default: 'manual'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Pre-save hook to set normalizedRole
roleRequirementsSchema.pre('save', function(next) {
  if (this.isModified('role')) {
    this.normalizedRole = this.role.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  next();
});

// Static method to find by role name (case insensitive)
roleRequirementsSchema.statics.findByRole = async function(roleName) {
  const normalizedRole = roleName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return this.findOne({ normalizedRole });
};

// Static method to get all active roles
roleRequirementsSchema.statics.getActiveRoles = function() {
  return this.find({ isActive: true })
    .select('role description experienceLevel')
    .sort('role');
};

// Index for text search
roleRequirementsSchema.index({
  role: 'text',
  description: 'text',
  'requiredSkills.name': 'text',
  'requiredSkills.category': 'text'
});

const RoleRequirements = mongoose.model('RoleRequirements', roleRequirementsSchema);

module.exports = RoleRequirements;
