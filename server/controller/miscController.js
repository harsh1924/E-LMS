import NewError from "../utils/NewError";
import sendEmail from "../utils/sendEmail";

export const contactUs = async(req, res, next) => {
    const {name, email, message} = req.body;
    if (!name || !email || !message) {
        return next(new NewError('All fields are required', 400));
    }

    try {
        const subject = 'Contact Us From';
        const textMessage = `${name} - ${email} <br /> ${message}`;
        await sendEmail(process.env.CONTACT_US_EMAIL)
    } catch (error) {
        console.log(error);
        return next(new NewError(error.message, 400));
    };

    res.status(200).json({
        success: true,
        message: 'Your Request has been submitted successfully'
    })
}