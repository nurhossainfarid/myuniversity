import { model, Schema } from 'mongoose'
import { TUser } from './user.interface'
import config from '../../config';
import bcrypt from 'bcrypt';

const userSchema = new Schema<TUser>(
  {
    id: {
      type: String,
      required: [true, 'User ID is required'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    needsPasswordChange: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: {
        values: ['student', 'faculty', 'admin'],
        message: "Role must be one of 'student', 'faculty', or 'admin'",
      },
      required: [true, 'User role is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['in-progress', 'blocked'],
        message: "Status must be either 'in-progress' or 'blocked'",
      },
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// pre save middleware/hook document middleware
userSchema.pre('save', async function(next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  // Hashing password and save into DB
  user.password = await bcrypt.hash(user.password, Number(config.bcrypt_salt_rounds));
  next();
})

userSchema.post('save', function(doc, next) {
  doc.password = '';
  next();
})

// create user model 
export const UserModel = model<TUser>('User', userSchema);
