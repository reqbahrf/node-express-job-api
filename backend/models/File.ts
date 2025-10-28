// models/File.ts
import mongoose from 'mongoose';
import { PURPOSE } from '../constant/allowedFileConfig.js';
interface IFile extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  filename: string;
  originalname: string;
  purpose: string;
  mimetype: string;
  size: number;
  path: string;
  url?: string;
  createdBy: mongoose.Schema.Types.ObjectId;
}

const FileSchema = new mongoose.Schema<IFile>(
  {
    filename: {
      type: String,
      required: true,
    },
    originalname: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

FileSchema.pre(
  'deleteOne',
  { document: true, query: false },
  async function (next) {
    const fileID = this._id;
    if (this.purpose === PURPOSE.REGISTRATION_DOCS) {
      await mongoose
        .model('CompanyInfo')
        .updateMany(
          { registrationDocs: fileID },
          { $pull: { registrationDocs: fileID } }
        );
    }
    next();
  }
);

export default mongoose.model('File', FileSchema);
