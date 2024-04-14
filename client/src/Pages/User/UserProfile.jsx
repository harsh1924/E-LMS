import { useDispatch } from "react-redux";
import Layout from "../../Layout/Layout";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { getUserData } from "../../Redux/authSlice";
import { Link } from "react-router-dom";

export default function UserProfile() {

    const dispatch = useDispatch();
    const userData = useSelector((state) => state?.auth?.data);

    // CANCEL SUBSCRIPTION FUNCTION
    // const handleCourseCancel = async () => {
    //     await dispatch(cancelCourseBundle());
    //     await dispatch(getUserData());
    // }

    useEffect(() => {
        dispatch(getUserData())
    }, []);

    return (
        <Layout>
<div className="min-h-[90vh] flex items-center justify-center">
    <div className="my-10 flex flex-col gap-4 rounded-lg p-4 text-white w-80 shadow-[0_0_10px_black]">
<img src={userData?.avatar?.secureURL} alt="user profile image" className="w-40 m-auto rounded-full border border-black" />
<h3 className="text-xl font-semibold text-center capitalize">
    {userData.name}
</h3>
<div className="grid grid-cols-2">
<p>Email:</p>
<p>{userData?.email}</p>
<p>Role:</p>
<p>{userData?.role}</p>
<p>Subscription:</p>
<p>
    {userData?.subscription?.status === 'active' ? 'Active' : 'Inactive'}
</p>
</div>

{/* BUTTON TO CHANGE THE PASSWORD */}
<div className="flex items-center justify-between gap-2">
<Link to={userData?.email === 'test@gmail.com' ? '/denied' : '/changepassword'} className="w-1/2 bg-yellow-600 hover:bg-yellow-700 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold cursor-pointer text-center" >
<button>Change Password</button>
</Link>    

<Link
to={userData?.email === 'test@gmail.com' ? '/denied' : '/user/editprofile'} className="w-1/2 border border-yellow-600 hover:border-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold cursor-pointer text-center" >
<button>Edit Profile</button>
</Link>
</div>
<p>cancelcourse</p>
{/* {userData?.subscription?.status === 'active' && (
    <button onClick={} >

    </button>
)} */}
</div>    
</div>
        </Layout>
    )
}