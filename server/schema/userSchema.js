import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Username is required'],
        minLength: [3, 'Username atleast contains 3 characters'],
        maxLength: [50, 'Username should be less than 50 characters'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Useremail is required'],
        lowercase: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false
    },
    subscription: {
        id: String,
        status: String
    },
    avatar: {
        publicId: String,
        secureURL: String
    },
    role: {
        type: String,
        default: 'USER',
        enum: ['ADMIN', 'USER']
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: String
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    };
    this.password = await bcrypt.hash(this.password, 10);
})

const userModel = model('user', userSchema);
export default userModel;