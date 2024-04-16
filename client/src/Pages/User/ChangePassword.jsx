import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { changePassword } from "../../Redux/authSlice";
import Layout from "../../Layout/Layout";
import { AiOutlineArrowLeft } from "react-icons/ai";

export default function ChangePassword() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userPassword, setUserPassword] = useState({
        oldPassword: '',
        newPassword: ''
    });

    const handlePasswordChange = (event) => {
        const { name, value } = event.target;
        setUserPassword({
            ...userPassword,
            [name]: value
        });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        if (!userPassword.oldPassword || !userPassword.newPassword) {
            toast.error('All fiedls are required');
            return;
        }

        if (
            !userPassword.newPassword.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/)
        ) {
            toast.error(
                "Minimum password length should be 6 with Uppercase, Lowercase, Number and Symbol"
            );
            return;
        }

        const res = await dispatch(changePassword(userPassword))
        setUserPassword({
            oldPassword: '',
            newPassword: ''
        });

        if (res?.payload?.success) {
            navigate('/user/profile');
        }
    }

        return (
            <Layout>
                <div className="flex items-center justify-center h-[100vh]">
                    <form className="flex flex-col justify-center gap-6 rounded-lg p-4 text-white w-80 h-[26rem] shadow-[0_0_10px_black]" onSubmit={handleFormSubmit}>
                        <h1 className="text-center text-2xl font-bold">Change Password</h1>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="oldPassword" className="text-lg font-semibold">Old Password</label>
                            <input type="password" className="px-2 py-1 border bg-transparent" required name="oldPassword" id="oldPassword" placeholder="Enter Your Old Password" value={userPassword.oldPassword} onChange={handlePasswordChange} />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="newPassword" className="text-lg font-semibold">
                                New Password
                            </label>
                            <input type="password" className="px-2 py-1 border bg-transparent" required name="newPassword" id="newPassword" placeholder="Enter your new Password" value={userPassword.newPassword} onChange={handlePasswordChange} />
                        </div>

                        <Link to={'/user/profile'}>
                            <p className="link text-accent cursor-pointer flex items-center justify-center w-full gap-2">
                                <AiOutlineArrowLeft /> Back to Profile
                            </p>
                        </Link>

                        <button className="w-full bg-yellow-600 hover:bg-yellow-700 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer" type="submit">
                            Change Password
                        </button>
                    </form>
                </div>
            </Layout>
        )
    }