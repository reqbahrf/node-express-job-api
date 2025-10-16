import mongoose from 'mongoose';

const JobPostSchema = new mongoose.Schema(
  {
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide job title'],
      trim: true,
      maxLength: 100,
    },
    company: {
      type: String,
      required: [true, 'Please provide company name'],
      trim: true,
      maxLength: 100,
    },
    // 📝 Markdown-supported description
    description: {
      type: String,
      required: [true, 'Please provide job description in Markdown format'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please provide location'],
      trim: true,
    },
    salaryRange: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
      default: 'full-time',
    },
    skillsRequired: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'draft'],
      default: 'open',
    },
    deadline: {
      type: Date,
      required: [true, 'Please provide application deadline'],
    },
    applicants: [
      {
        applicantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ['pending', 'viewed', 'shortlisted', 'hired', 'rejected'],
          default: 'pending',
        },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model('JobPost', JobPostSchema);
