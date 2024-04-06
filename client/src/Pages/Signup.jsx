import { useState } from "react";
import { toast } from 'react-hot-toast'
import { useDispatch } from "react-redux";
import { Link, useNavigate } from 'react-router-dom'
import { createAccount } from "../Redux/authSlice";
import Layout from "../Layout/Layout";
import { BsPersonCircle } from "react-icons/bs";

export default function Signup() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [previewImage, setPreviewImage] = useState('');

    // USER INPUT
    const [signupData, setSignupData] = useState({
        name: '',
        email: '',
        password: '',
        avatar: ''
    });

    // SET SIGNUP DATA
    const handleUserInput = (event) => {
        const { name, value } = event.target;
        setSignupData({
            ...signupData,
            [name]: value
        });
    };

    // HANDLE IMAGE UPLOAD
    const getImage = (event) => {
        event.preventDefault();
        // getting image
        const uploadedImage = event.target.files[0];
        // if exists getting image url
        if (uploadedImage) {
            setSignupData({
                ...signupData,
                avatar: uploadedImage
            });
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener('load', function () {
                setPreviewImage(this.result)
            });
        }
    };

    // CREATE ACCOUNT FUNCTION
    const createNewAccount = async (event) => {
        event.preventDefault();
        if (
            !signupData.avatar ||
            !signupData.email ||
            !signupData.name ||
            !signupData.password
        ) {
            toast.error('Please fill all the fields');
            return;
        }

        if (signupData.name.length < 3) {
            toast.error('Name should be atleast of 3 characters');
            return;
        }

        if (
            !signupData.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
        ) {
            toast.error("Invalid email id");
        return;
        }

        if (!signupData.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)) {
            toast.error(
                "Minimum password length should be 8 with Uppercase, Lowercase, Number and Symbol"
            );
            return;
        }

        // CREATING FORM DATA
        const formData = new FormData();
        formData.append('name', signupData.name);
        formData.append('email', signupData.email);
        formData.append('password', signupData.password);
        formData.append('avatar', signupData.avatar);

        // CALLING CREATE ACCOUNT ACTION
        const res = await dispatch(createAccount(formData));
        if (res.payload.success) {
            navigate('/login');
        }

        setSignupData({
            name: '',
            email: '',
            password: '',
            avatar: ''
        });
        setPreviewImage('');
    }

    return (
        <Layout>
            <div className="flex items-center justify-center h-[100vh]">
                <form
                    onSubmit={createNewAccount}
                    className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black]"
                >
                    <h1 className="text-center text-2xl font-bold">Registration Page</h1>

                    {/* IMAGE INPUT */}
                    <label htmlFor="image_uploads" className=" cursor-pointer">
                        {previewImage ? (
                            <img src={previewImage} alt="preview Image" className="w-24 h-2/4 rounded-full m-auto" />
                        ) : (
                            <BsPersonCircle className="w-24 h-2/4 rounded-full m-auto" />
                        )}
                    </label>
                    <input type="file" className="hidden" onChange={getImage} id="image_uploads" name="image_uploads" accept=".jpg, .jpeg, .png" />

                    {/* NAME INPUT */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="name" className="font-semibold">Name</label>
                        <input type="text" required id="name" name="name" placeholder="Enter your name" className="px-2 bg-transparent py-1 border" value={signupData.name} onChange={handleUserInput} />
                    </div>
                    {/* input for email */}
                    <div className="flex flex-col gap-1">
                        <label className="font-semibold" htmlFor="email">
                            Email
                        </label>
                        <input
                        autoComplete="off"
                            required
                            type="text"
                            name="email"
                            id="email"
                            placeholder="Enter your email"
                            className="bg-transparent px-2 py-1 border"
                            value={signupData.email}
                            onChange={handleUserInput}
                        />
                    </div>

                    {/* input for password */}
                    <div className="flex flex-col gap-1">
                        <label className="font-semibold" htmlFor="password">
                            Password
                        </label>
                        <input
                            required
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Enter your password"
                            className="bg-transparent px-2 py-1 border"
                            value={signupData.password}
                            onChange={handleUserInput}
                        />
                    </div>

                    {/* REGISTRATION BUTTON */}
                    <button className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer" type="submit">
                        Create Account</button>

                    <p className="text-center">
                        Already have an account ? {" "}
                        <Link to={'/login'} className="link text-accent cursor-pointer">Login</Link>
                    </p>
                </form>
            </div>
        </Layout>
    )
}