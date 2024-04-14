import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import RequireAuth from "./Components/RequireAuth";
import UserProfile from "./Pages/User/UserProfile";
import NotFound from "./Pages/NotFound";
import Contact from "./Pages/Contact";

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
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App;