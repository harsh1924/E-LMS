import userModel from "../schema/userSchema.js";
import fs from 'fs/promises'
import { v2 } from 'cloudinary';
import NewError from "../utils/NewError.js";
import emailValidator from 'email-validator'

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