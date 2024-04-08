import { useSelector } from "react-redux";
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom";
import { FiMenu } from 'react-icons/fi'
import { AiFillCloseCircle } from 'react-icons/ai'
import Footer from "../Pages/Footer";
import { logout } from "../Redux/authSlice";

const Layout = ({ children }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isLoggedIn = useSelector((state) =>
        state?.auth?.isLoggedIn);

    const role = useSelector((state) => state?.auth?.role);

    const hideDrawer = () => {
        const element = document.getElementsByClassName('drawer-toggle');
        element[0].checked = false;

        const drawerSide = document.getElementsByClassName('drawer-side');
        drawerSide[0].style.width = 0;
    };

    const changeWidth = () => {
        const drawerSide = document.getElementsByClassName('drawer-side');
        drawerSide[0].style.width = 'auto';
    }

    const handleLogout = async (event) => {
        event.preventDefault();
        const res = await dispatch(logout());
        if (res?.payload?.success) navigate('/');
    };

    return (
        <div className=" min-h-[90vh]">
            <div className="drawer absolute z-50 left-0 w-fit">
                <input type="checkbox" id="my-drawer" className="drawer-toggle" />
                <div className="drawer-content">
                    <label htmlFor="my-drawer" className=" cursor-pointer relative">
                        <FiMenu onClick={changeWidth} size={'32px'} className='m-4 font-bold text-white' />
                    </label>
                </div>

                <div className="drawer-side w-0">
                    <label htmlFor="my-drawer" className="drawer-overlay"></label>
                    <ul className="menu pb-20 p-4 w-48 sm:w-80 bg-base-100 text-base-content relative">
                        <li className="w-fit absolute right-2 z-50">
                            <button onClick={hideDrawer}>
                                <AiFillCloseCircle size={24} />
                            </button>
                        </li>
                        <li>
                            <Link to={'/'}>Home</Link>
                        </li>
                        {/* {isLoggedIn && role === 'ADMIN' && (
    <li>
        <Link to={'admin/dashboard'}>Admin Dashboard</Link>
    </li>
)} */}

                        <li>
                            <Link to={'/courses'}>All Courses</Link>
                        </li>
                        <li>
                            <Link to={'/contact'}>Contact us</Link>
                        </li>
                        <li>
                            <Link to={'/about'}>About us</Link>
                        </li>

                        {!isLoggedIn && (
                            <li className="absolute bottom-0 w-[90%]">
                                <div className="w-full flex items-center justify-center">
                                    <button className="btn btn-primary px-4 py-1 font-semibold rounded-md w-[50%]">
                                        <Link to={'login'}>Login</Link>
                                    </button>
                                    <button className="btn btn-secondary px-4 py-1 font-semibold rounded-md w-[50%]">
                                        <Link to={'/signup'}>Signup</Link>
                                    </button>
                                </div>
                            </li>
                        )}

                        {isLoggedIn && (
                            <li className="absolute bottom-0 w-[90%]">
                                <div className="w-full flex items-center justify-center">
                                    <button className="btn btn-primary px-4 py-1 font-semibold rounded-md w-[50%]">
                                        <Link to={'/user/profile'}>Profile</Link>
                                    </button>
                                    <button className="btn btn-secondary px-4 py-1 font-semibold rounded-md w-[50%]">
                                        <Link onClick={handleLogout}>Logout</Link>
                                    </button>
                                </div>
                            </li>
                        )}

                    </ul>
                </div>
            </div>

            {children}
            <Footer />
        </div>
    )
};

export default Layout