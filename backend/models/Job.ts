import mongoose from 'mongoose';
const JobSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Please provide company name'],
      maxLength: 50,
    },
    companyInfo: {
      type: mongoose.Types.ObjectId,
      ref: 'CompanyInfo',
      required: [true, 'Please provide company info'],
    },
    position: {
      type: String,
      required: [true, 'Please provide position'],
      maxLength: 100,
    },
    status: {
      type: String,
      enum: ['pending', 'interview', 'declined'],
      default: 'pending',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Job', JobSchema);
