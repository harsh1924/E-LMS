import userModel from "../schema/userSchema.js";
import fs from 'fs/promises'
import { v2 } from 'cloudinary';
import NewError from "../utils/NewError.js";
import emailValidator from 'email-validator'

const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
}

// CREATE ACCOUNT
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
                user.avatar.publicId = result.public_id;
                user.avatar.secureURL = result.secure_url;
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

// LOGIN
export const login = async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return next(new NewError('Email and Password are required', 400))
    }

    const user = await userModel.findOne({ email }).select('+password')
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
};

// LOGOUT
export const logout = async (req, res, next) => {
    res.cookie('token', null, {
        maxAge: 0,
        httpOnly: true
    });
    res.status(200).json({
        success: true,
        message: 'User Logged Out Successfully'
    })
};

// GEETING USER INFO
export const getUserDetails = async (req, res, next) => {
    const user = await userModel.findById(req.user.id);
    res.status(200).json({
        success: true,
        message: 'User Details:',
        user
    })
}

// UPDATE USER
export const updateUser = async (req, res, next) => {
    const { name } = req.body;
    const { id } = req.params;
    const user = await userModel.findById(id);

    if (!user) {
        return next(new NewError('Invalid User Account or User does not exist'), 400);
    }

    if (name) {
        user.name = name;
    }
    if (req.file) {
        await v2.uploader.destroy(user.avatar.publicId);

        try {
            const result = await v2.uploader.upload(req.file.path, {
                folder: 'lms',
                width: 250,
                height: 250,
                gravity: 'faces',
                crop: 'fill'
            });
            if (result) {
                user.avatar.publicId = result.public_id;
                user.avatar.secureURL = result.secure_url;
                fs.rm(`uploads/${req.file.filename}`);
            }
        } catch (error) {
            return next(new NewError(error.message, 400));
        }
    }
    await user.save();
    res.status(200).json({
        success: true,
        message: 'User Details Updated Successfully'
    })
}

// CHANGE PASSWORD
export const changePassword = async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.user; // bcoz of isLoggedIn we will get the user id
    
    if (!oldPassword || !newPassword) {
        return next(new NewError('Old and New Password are required', 400));
    }

    const user = await userModel.findById(id).select('+password');
    if (!user) {
        return next(new NewError('Invalid user id or user does not exist', 400));
    }

    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
        return next(new NewError('Invalid Old Password', 400));
    }

    user.password = newPassword;
    await user.save();
    user.password = undefined;
    res.status(200).json({
        success: true,
        message: 'Password Changed Successfully'
    })
}