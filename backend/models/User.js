import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const UserSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minLength: [8, 'Password must be at least 8 characters'],
  },
});

UserSchema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.createJWT = function () {
  const generateJWT = (secret, lifetime) => {
    return jwt.sign({ userId: this._id, username: this.name }, secret, {
      expiresIn: lifetime,
    });
  };
  return {
    accessToken: generateJWT(
      process.env.JWT_ACCESS_SECRET,
      process.env.JWT_ACCESS_LIFETIME
    ),
    refreshToken: generateJWT(
      process.env.JWT_REFRESH_SECRET,
      process.env.JWT_REFRESH_LIFETIME
    ),
  };
};

UserSchema.methods.comparePassword = async function (userProvidedPassword) {
  const isMatch = await bcrypt.compare(userProvidedPassword, this.password);
  return isMatch;
};
export default mongoose.model('User', UserSchema);
