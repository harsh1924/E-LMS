import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getUserData, updateProfile } from "../../Redux/authSlice";
import Layout from "../../Layout/Layout";
import { BsPersonCircle } from "react-icons/bs";
import { Link } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";

export default function EditProfile() {
    const dispatch = useDispatch();
    const [previewImage, setPreviewImage] = useState('');

    const [data, setData] = useState({
        name: '',
        avatar: undefined,
        userID: useSelector((state) => state?.auth?.data?._id)
    });

    // IMAGE UPLOAD FUNCTION
    const getImage = (event) => {
        event.preventDefault();
        const uploadedImage = event.target.files[0];
        if (uploadedImage) {
            setData({
                ...data,
                avatar: uploadedImage
            });
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener('load', function () {
                setPreviewImage(this.result)
            });
        }
    };

    // FUNCTION TO SET THE NAME OF USER
    const setName = (event) => {
        const { name, value } = event.target;
        const newUserData = {
            ...data,
            [name]: value
        };
        setData(newUserData)
    };

    // FORM SUBMISSION FUNCTION
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        if (!data.name || !data.avatar) {
            toast.error('All fields are mandatory')
            return;
        }
        if (data.name.length < 3) {
            toast.error('Name should have more than 3 characters');
        }

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('avatar', data.avatar);
        const newUserData = [data.userID, formData];
        await dispatch(updateProfile(newUserData));
        await dispatch(getUserData());

    };

    return (
        <Layout>
            <div className="flex items-center justify-center h-[100vh]">
                <form className="flex flex-col justify-center gap-5 rounded-lg p-4 text-white w-80 h-[26rem] shadow-[0_0_10px_black]" onSubmit={handleFormSubmit}>
                    <h1 className="text-center text-2xl font-bold">
                        Edit Profile Page
                    </h1>
                    <label htmlFor="image_uploads" className="cursor-pointer">
                        {previewImage ? (
                            <img src={previewImage} alt="preview image" className="w-28 h-28 rounded-full m-auto" />
                        ) : (
                            <BsPersonCircle className="w-28 h-28 rounded-full m-auto" />
                        )}
                    </label>
                    <input type="file" className="hidden" onChange={getImage} id="image_uploads" name="image_uploads" accept=".jpg, .jpeg, .png" />
                    <div className="flex flex-col gap-1">
                        <label htmlFor="name" className="text-lg font-semibold">Name
                        </label>
                        <input type="text" className="px-2 py-1 bg-transparent border" required name="name" placeholder="Enter your full name" value={data?.name} onChange={setName} />
                    </div>

                    <Link to={'/user/profile'} >
                        <p className="link text-accent cursor-pointer flex items-center justify-center w-full gap-2">
                            <AiOutlineArrowLeft /> Back to Profile
                        </p>
                    </Link>

                    <button className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer" type="submit">
                        Update Profile
                    </button>
                </form>
            </div>
        </Layout>
    )
}