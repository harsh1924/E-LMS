import userModel from "../schema/userSchema.js";
import fs from 'fs/promises'
import { v2 } from 'cloudinary';
import NewError from "../utils/NewError.js";
import emailValidator from 'email-validator'

const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
}

export const signup = async (req, res, next) => {
    const { name, email, password } = req.body;
    const validEmail = emailValidator.validate(email);

    if (!name || !email || !password) {
        return next(new NewError('All fields are required', 400));
    }
    if (!validEmail) {
        return next(new NewError('Please provide a valid email', 400));
    }

    const userExists = await userModel.findOne({ email });
    if (userExists) {
        return next(new NewError('User already exists. Please Login', 400));
    }

    const user = await userModel.create({
        name,
        email,
        password,
        avatar: {
            publicId: email,
            secureURL: 'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg'
        }
    });
    if (!user) {
        return next(new NewError('Account Creation Failed', 400));
    };

    if (req.file) {
        try {
            const result = await v2.uploader.upload(req.file.path, {
                folder: 'lms',
                width: 250,
                height: 250,
                gravity: 'faces',
                crop: 'fill'
            });
            if (result) {
                user.avatar.publicId = result.publicId;
                user.avatar.secureURL = result.secureURL;
                fs.rm(`uploads/${req.file.filename}`)
            }
        } catch (error) {
            return next(new NewError(error.message, 400));
        }
    }

    await user.save();
    res.status(201).json({
        success: true,
        message: 'Account Created Successfully',
        user
    })
}

export const login = async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return next(new NewError('Email and Password are required', 400))
    }

    const user = await userModel.findOne({email}).select('+password')
    console.log(user);
    if (!(user && (await user.comparePassword(password)))) {
        return next(new NewError('Email or password do not match or user does not exist', 400))
    }

    const token = await user.generateJWTToken()

    user.password = undefined
    res.cookie('token', token, cookieOptions)
    res.status(200).json({
        success: true,
        message: 'User Logged in successfully',
        user
    })
}