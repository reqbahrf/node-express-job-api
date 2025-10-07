Folder structure:
├── backend/
├── .gitignore
├── app.ts
├── tsconfig.json
├── controllers/
│ ├── adminDashboard.ts
│ ├── auth.ts
│ ├── job.ts
├── db/
│ ├── connect.ts
├── dist/
├── errors/
│ ├── bad-request.ts
│ ├── custom-api.ts
│ ├── error.d.ts
│ ├── index.ts
│ ├── not-found.ts
│ ├── unauthenticated.ts
├── middleware/
│ ├── adminUser.ts
│ ├── authenticated.ts
│ ├── error-handler.ts
│ ├── expressSanitizer.ts
│ ├── not-found.ts
├── models/
│ ├── Job.ts
│ ├── User.ts
├── routes/
│ ├── adminDashboard.ts
│ ├── auth.ts
│ ├── jobs.ts
├── service/
│ ├── getApplicantUserCount.ts
├── types/
│ ├── express.d.ts
├── utils/
│ ├── auth.ts

Concatenated content:

---/---

--.gitignore--

dist

--app.ts--

import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
import path from 'path';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { fileURLToPath } from 'url';

const **filename = fileURLToPath(import.meta.url);
const **dirname = path.dirname(\_\_filename);

//security packages
import helmet from 'helmet';
import cors from 'cors';
import rateLimiter from 'express-rate-limit';
// connectDB
import connectDB from './db/connect.js';

import adminUser from './middleware/adminUser.js';
import authMiddleware from './middleware/authenticated.js';
import expressSanitizer from './middleware/expressSanitizer.js';

// routers
import authRouter from './routes/auth.js';
import jobRouter from './routes/jobs.js';
import adminRouter from './routes/adminDashboard.js';

// error handler
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';

const onlineUsers = new Map();
const server = createServer(app);
const io = new Server(server, {
cors: {
origin: 'http://localhost:5173',
credentials: true,
},
});

io.on('connection', (socket) => {
socket.on('join', (userid) => {
onlineUsers.set(userid, socket.id);
io.emit('rt-user-count', onlineUsers.size);
});
socket.on('disconnect', () => {
for (let [userId, socketId] of onlineUsers.entries()) {
if (socketId === socket.id) {
onlineUsers.delete(userId);
break;
}
}
io.emit('rt-user-count', onlineUsers.size);
});
socket.on('leave', (userid) => {
onlineUsers.delete(userid);
io.emit('rt-user-count', onlineUsers.size);
});
});
// extra packages
app.set('trust proxy', 1);
// app.use(
// rateLimiter({
// windowMs: 15 _ 60 _ 1000, // 15 minutes
// max: 100, // limit each IP to 100 requests per windowMs
// })
// );
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

// Enable CORS for development
app.use(
cors({
origin: 'http://localhost:5173',
credentials: true,
})
);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
// Serve static files from the React app
app.use(express.static(path.join(\_\_dirname, '../frontend/dist')));

// Handle React routing, return all requests to React's index.html
app.get(/^(?!\/api\/).\*/, (req, res) => {
res.sendFile(path.join(\_\_dirname, '../frontend/dist', 'index.html'));
});
}

app.use('/api/v1/admin', authMiddleware, adminUser, adminRouter);
// API routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authMiddleware, expressSanitizer(), jobRouter);
app.use(/^(?!\/api\/).\*/, notFoundMiddleware);

// Error handling
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
try {
const secret = process.env.MONGO_URI;
if (!secret) throw new Error('Mongo URI not found');
await connectDB(secret);
server.listen(port, () =>
console.log(`Server is listening on port ${port}...`)
);
} catch (error) {
console.log(error);
}
};

start();

--tsconfig.json--

{
"compilerOptions": {
"target": "ES2022" /_ Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', 'ES2021', 'ES2022', 'ESNext'. _/,
"module": "NodeNext" /_ Specify module code generation: 'None', 'CommonJS', 'AMD', 'System', 'UMD', 'ES6', 'ES2015', 'ES2020', 'ES2022', 'ESNext', 'Node16', 'NodeNext'. _/,
"moduleResolution": "nodeNext",
"rootDir": "./" /_ Specify the root directory of input files. Use to control the output directory structure with --outDir. _/,
"outDir": "./dist" /_ Redirect output structure to the directory. _/,
"esModuleInterop": true /_ Emit additional JavaScript to ease support for importing CommonJS modules. This enables `allowSyntheticDefaultImports` for type compatibility. _/,
"forceConsistentCasingInFileNames": true /_ Ensure that casing is consistent across all file paths. _/,
"strict": true /_ Enable all strict type-checking options. _/,
"skipLibCheck": true /_ Skip type checking all .d.ts files. _/,
"resolveJsonModule": true /_ Enable importing .json files _/,
"sourceMap": true /_ Emit corresponding .map files. _/
},
"include": [
"./**/*.ts"
] /_ Specify an array of filenames or patterns to include in the program. _/,
"exclude": ["node_modules", "dist"]
}

---controllers/---

--adminDashboard.ts--

import { Request, Response } from 'express';
import getApplicantUserCount from '../service/getApplicantUserCount.js';
const getDashboardStats = async (req: Request, res: Response) => {
const applicantUserCount = await getApplicantUserCount();
const stats = {
applicantUserCount,
};
res.status(200).json(stats);
};

export { getDashboardStats };

--auth.ts--

import User from '../models/User.js';
import { BadRequestError, UnauthenticatedError } from '../errors/index.js';
import setTokenCookie from '../utils/auth.js';
import { StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from 'express';

interface UserJwtPayload extends JwtPayload {
userId: string;
username: string;
role: string;
}

const login = async (req: Request, res: Response) => {
const { email, password } = req.body;
if (!email || !password)
throw new BadRequestError('Please provide the email and password');
const user = await User.findOne({ email });
if (!user) throw new UnauthenticatedError('Invalid credentials');

const isMatch = await user.comparePassword(password);
if (!isMatch) throw new UnauthenticatedError('Invalide credentials');
const { accessToken, refreshToken } = user.createJWT();
setTokenCookie(res, refreshToken);
res
.status(StatusCodes.OK)
.json({ username: user.name, role: user.role, accessToken });
};
const logout = async (req: Request, res: Response) => {
res.clearCookie('resToken');
res.status(StatusCodes.OK).json({ message: 'User logged out' });
};
const register = async (req: Request, res: Response) => {
const user = await User.create(req.body);
const { accessToken, refreshToken } = user.createJWT();
setTokenCookie(res, refreshToken);
res
.status(StatusCodes.CREATED)
.json({
userid: user.\_id,
username: user.name,
role: user.role,
accessToken,
});
};

const refreshToken = async (req: Request, res: Response) => {
const { resToken } = req.cookies;
console.log(resToken);
if (!resToken) throw new UnauthenticatedError('Authentication invalid');
try {
const secret = process.env.JWT_REFRESH_SECRET;
if (!secret) throw new UnauthenticatedError('Authentication invalid');
const decode = jwt.verify(resToken, secret) as UserJwtPayload;
const user = await User.findOne({ \_id: decode.userId });
if (!user) return;
const accessToken = user.generateAccessToken();
res
.status(StatusCodes.OK)
.json({
userid: user.\_id,
username: user.name,
role: user.role,
accessToken,
});
} catch (error) {
console.log(error);
throw new UnauthenticatedError('Authentication invalid');
}
};

export { login, register, logout, refreshToken };

--job.ts--

import Job from '../models/Job.js';
import { StatusCodes } from 'http-status-codes';
import {
BadRequestError,
NotFoundError,
UnauthenticatedError,
} from '../errors/index.js';
import { Request, Response } from 'express';
import { UserPayload } from '../types/express.js';

const getAllJobs = async (req: Request, res: Response) => {
const jobs = await Job.find({ createdBy: req?.user?.userId }).sort(
'createdAt'
);
res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};
const getJob = async (req: Request, res: Response) => {
if (!req?.user) {
throw new UnauthenticatedError('Authentication invalid');
}
const {
params: { id: jobId },
user: { userId },
} = req;
const job = await Job.findOne({ \_id: jobId, createdBy: userId });
if (!job) {
throw new NotFoundError(`Job not found with an ${jobId} id`);
}
res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req: Request, res: Response) => {
req.body.createdBy = req?.user?.userId;
const job = await Job.create(req.body);
res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req: Request, res: Response) => {
if (!req?.user) {
throw new UnauthenticatedError('Authentication invalid');
}
const {
body: { company, position },
params: { id: jobId },
user: { userId },
} = req;
if (!company || !position) {
throw new BadRequestError('Please provide company and position');
}

const job = await Job.findOneAndUpdate(
{ \_id: jobId, createdBy: userId },
req.body,
{
new: true,
runValidators: true,
}
);
if (!job) {
throw new NotFoundError(`Job not found with an ${jobId} id`);
}
res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req: Request, res: Response) => {
if (!req?.user) {
throw new UnauthenticatedError('Authentication invalid');
}
const {
params: { id: jobId },
user: { userId },
} = req;
const job = await Job.findOneAndDelete({ \_id: jobId, createdBy: userId });
if (!job) {
throw new NotFoundError(`Job not found with an ${jobId} id`);
}
res.status(StatusCodes.OK).send();
};

export { getAllJobs, getJob, createJob, updateJob, deleteJob };

---db/---

--connect.ts--

import mongoose from 'mongoose';

const connectDB = (url: string) => {
const options = {
maxPoolSize: 10,
serverSelectionTimeoutMS: 5000,
socketTimeoutMS: 45000,
bufferCommands: false,
};

return mongoose.connect(url, options);
};

export default connectDB;

---dist/---

---errors/---

--bad-request.ts--

import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './custom-api.js';

class BadRequestError extends CustomAPIError {
public statusCode: number;
constructor(message: string) {
super(message);
this.statusCode = StatusCodes.BAD_REQUEST;
}
}

export default BadRequestError;

--custom-api.ts--

export default class CustomAPIError extends Error {
constructor(message: string) {
super(message);
}
}

--error.d.ts--

export interface CustomError {
statusCode?: number;
message: string;
name: string;
code?: number; // e.g. 11000 for duplicate key
keyValue?: Record<string, unknown>;
errors?: Record<string, { message: string }>;
value?: unknown;
}

--index.ts--

import CustomAPIError from './custom-api.js';
import UnauthenticatedError from './unauthenticated.js';
import NotFoundError from './not-found.js';
import BadRequestError from './bad-request.js';
import type { CustomError } from './error.d.js';

export { CustomAPIError, UnauthenticatedError, NotFoundError, BadRequestError };
export type { CustomError };

--not-found.ts--

import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './custom-api.js';

class NotFoundError extends CustomAPIError {
public statusCode: number;
constructor(message: string) {
super(message);
this.statusCode = StatusCodes.NOT_FOUND;
}
}

export default NotFoundError;

--unauthenticated.ts--

import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './custom-api.js';

class UnauthenticatedError extends CustomAPIError {
public statusCode: number;
constructor(message: string) {
super(message);
this.statusCode = StatusCodes.UNAUTHORIZED;
}
}

export default UnauthenticatedError;

---middleware/---

--adminUser.ts--

import { Request, Response, NextFunction } from 'express';
import { UnauthenticatedError } from '../errors/index.js';
const adminUser = (req: Request, res: Response, next: NextFunction) => {
const role = req.user?.role;
if (role !== 'admin') {
throw new UnauthenticatedError('Authentication invalid');
}
next();
};

export default adminUser;

--authenticated.ts--

import jwt from 'jsonwebtoken';
import { UnauthenticatedError } from '../errors/index.js';
import { Request, Response, NextFunction } from 'express';
import { UserPayload } from '../types/express.js';

const auth = async (req: Request, res: Response, next: NextFunction) => {
const secret = process.env.JWT_ACCESS_SECRET as string;
const token = req.headers.authorization;
if (!token || !token.startsWith('Bearer ')) {
throw new UnauthenticatedError('Authentication invalid no token provided');
}
const jwtToken = token.split('Bearer ')[1];
try {
const decode = jwt.verify(jwtToken, secret) as UserPayload;
req.user = {
userId: decode.userId,
username: decode.username,
role: decode.role,
};
next();
} catch (error) {
throw new UnauthenticatedError('Authentication invalid token expired');
}
};

export default auth;

--error-handler.ts--

import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/index.js';
const errorHandlerMiddleware = (
err: CustomError,
req: Request,
res: Response,
next: NextFunction
) => {
let customError = {
errCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
errMsg: err.message || 'Something went wrong, please try again later',
};
if (err.name === 'ValidationError') {
customError.errCode = StatusCodes.BAD_REQUEST;
customError.errMsg = Object.values(err.errors || {})
.map((error) => error.message)
.join(',');
}
if (err.name === 'CastError') {
customError.errMsg = `No item found with id: ${err.value}`;
customError.errCode = StatusCodes.NOT_FOUND;
}
if (err.code === 11000 && err.keyValue) {
customError.errCode = StatusCodes.BAD_REQUEST;
customError.errMsg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
}
// res.status(customError.errCode).json({ err });
res.status(customError.errCode).json({ msg: customError.errMsg });
};

export default errorHandlerMiddleware;

--expressSanitizer.ts--

import sanitizeHtml from 'sanitize-html';
import { Request, Response, NextFunction } from 'express';

type value = string | object | Array<any> | null;

const expressSanitizer = (options = {}) => {
const defaultOptions = {
allowedTags: [],
allowedAttributes: {},
};
const finalOptions = { ...defaultOptions, ...options };

function deepSanitize(value: value): value {
if (typeof value !== 'object' || value === null) {
return typeof value === 'string'
? sanitizeHtml(value, finalOptions)
: value;
}

    if (Array.isArray(value)) {
      return value.length > 0 ? value.map(deepSanitize) : value;
    }

    const sanitizedObj: { [key: string]: value } = {};
    const objectValue = value as Record<string, any>;
    for (const key in objectValue) {
      if (objectValue.hasOwnProperty(key)) {
        sanitizedObj[key] = deepSanitize(objectValue[key]);
      }
    }
    return sanitizedObj;

}

return async (req: Request, res: Response, next: NextFunction) => {
try {
if (req.body && Object.keys(req.body).length > 0) {
req.body = deepSanitize(req.body);
}
if (req.query && Object.keys(req.query).length > 0) {
const sanitizedQuery = deepSanitize(req.query);
Object.assign(req.query, sanitizedQuery);
}
next();
} catch (error) {
next(error);
}
};
};

export default expressSanitizer;

--not-found.ts--

import { Request, Response } from 'express';
const notFoundMiddleware = (req: Request, res: Response) =>
res.status(404).send('Route does not exist');

export default notFoundMiddleware;

---models/---

--Job.ts--

import mongoose from 'mongoose';
const JobSchema = new mongoose.Schema(
{
company: {
type: String,
required: [true, 'Please provide company name'],
maxLength: 50,
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

--User.ts--

import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface IUser extends Document {
name: string;
email: string;
password: string;
role: string;
\_generateJWT(secret: string, lifetime: string): string;
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
/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)\*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
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

UserSchema.methods.\_generateJWT = function (
secret: jwt.Secret,
lifetime: jwt.SignOptions['expiresIn']
): string {
return jwt.sign(
{ userId: this.\_id, username: this.name, role: this.role },
secret,
{
expiresIn: lifetime,
}
);
};

UserSchema.methods.generateAccessToken = function (): string {
return this.\_generateJWT(
process.env.JWT_ACCESS_SECRET,
process.env.JWT_ACCESS_LIFETIME
);
};

UserSchema.methods.generateRefreshToken = function (): string {
return this.\_generateJWT(
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

---routes/---

--adminDashboard.ts--

import express from 'express';
import { getDashboardStats } from '../controllers/adminDashboard.js';
const router = express.Router();

router.get('/dashboard', getDashboardStats);

export default router;

--auth.ts--

import { login, logout, register, refreshToken } from '../controllers/auth.js';
import express from 'express';
const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/refresh-token', refreshToken);
router.post('/logout', logout);

export default router;

--jobs.ts--

import {
getAllJobs,
getJob,
createJob,
updateJob,
deleteJob,
} from '../controllers/job.js';

import express from 'express';
const router = express.Router();

router.route('/').get(getAllJobs).post(createJob);
router.route('/:id').get(getJob).patch(updateJob).delete(deleteJob);

export default router;

---service/---

--getApplicantUserCount.ts--

import User from '../models/User.js';

const getApplicantUserCount = async () => {
const count = await User.countDocuments({ role: 'applicant' });
return count;
};

export default getApplicantUserCount;

---types/---

--express.d.ts--

import { Request } from 'express';

interface UserPayload {
userId: string;
username: string;
role: string;
}

declare global {
namespace Express {
interface Request {
user?: UserPayload;
}
}
}

---utils/---

--auth.ts--

const setTokenCookie = (res: any, refreshToken: string) => {
res.cookie('resToken', refreshToken, {
httpOnly: true,
secure: process.env.NODE_ENV === 'production',
sameSite: 'strict',
maxAge: 24 _ 60 _ 60 \* 1000,
});
};

export default setTokenCookie;
