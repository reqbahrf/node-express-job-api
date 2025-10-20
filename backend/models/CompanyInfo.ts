import mongoose from 'mongoose';

const CompanyInfoSchema = new mongoose.Schema(
  {
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    companyName: {
      type: String,
      required: [true, 'Please provide company name'],
      trim: true,
      maxlength: 100,
    },
    ceoName: {
      type: String,
      required: [true, 'Please provide CEO name'],
    },
    industry: {
      type: String,
      required: [true, 'Please provide industry type'],
    },
    address: {
      type: String,
      required: [true, 'Please provide company address'],
    },
    website: {
      type: String,
      default: '',
    },
    contactEmail: {
      type: String,
      required: [true, 'Please provide contact email'],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email address',
      ],
    },
    contactPhone: {
      type: String,
      required: [true, 'Please provide contact number'],
    },
    logoUrl: {
      type: String,
      default: '',
    },
    registrationDocs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
        default: [],
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model('CompanyInfo', CompanyInfoSchema);
