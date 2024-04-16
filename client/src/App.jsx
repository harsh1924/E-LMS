import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import RequireAuth from "./Components/RequireAuth";
import UserProfile from "./Pages/User/UserProfile";
import NotFound from "./Pages/NotFound";
import Contact from "./Pages/Contact";
import EditProfile from "./Pages/User/EditProfile";
import ChangePassword from "./Pages/User/ChangePassword";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />

        <Route element={<RequireAuth allowedRoles={['USER', 'ADMIN']} />} >
          <Route path="/user/profile" element={<UserProfile />} />
          <Route path="/user/editprofile" element={<EditProfile />} />
          <Route path="/user/changepassword" element={<ChangePassword />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App;