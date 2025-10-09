import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  _generateJWT(secret: string, lifetime: string): string;
  generateAccessToken(): string;
  generateRefreshToken(): string;
  createJWT(): { accessToken: string; refreshToken: string };
  comparePassword(userProvidedPassword: string): Promise<boolean>;
}
const UserSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minLength: [3, 'Name must be at least 3 characters'],
    maxLength: [20, 'Name must be less than 20 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide valid email',
    ],
    unique: true,
  },
  role: {
    type: String,
    enum: ['applicant', 'admin'],
    default: 'applicant',
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minLength: [8, 'Password must be at least 8 characters'],
  },
});

UserSchema.pre('save', async function (): Promise<void> {
  const isAdmin = process.env.ADMIN_ACCOUNTS?.split(',').includes(this.email);
  if (isAdmin) this.role = 'admin';
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods._generateJWT = function (
  secret: jwt.Secret,
  lifetime: jwt.SignOptions['expiresIn']
): string {
  return jwt.sign(
    {
      userId: this._id,
      email: this.email,
      username: this.name,
      role: this.role,
    },
    secret,
    {
      expiresIn: lifetime,
    }
  );
};

UserSchema.methods.generateAccessToken = function (): string {
  return this._generateJWT(
    process.env.JWT_ACCESS_SECRET,
    process.env.JWT_ACCESS_LIFETIME
  );
};

UserSchema.methods.generateRefreshToken = function (): string {
  return this._generateJWT(
    process.env.JWT_REFRESH_SECRET,
    process.env.JWT_REFRESH_LIFETIME
  );
};

UserSchema.methods.createJWT = function (): {
  accessToken: string;
  refreshToken: string;
} {
  return {
    accessToken: this.generateAccessToken(),
    refreshToken: this.generateRefreshToken(),
  };
};

UserSchema.methods.comparePassword = async function (
  userProvidedPassword: string
): Promise<boolean> {
  const isMatch = await bcrypt.compare(userProvidedPassword, this.password);
  return isMatch;
};
export default mongoose.model('User', UserSchema);
