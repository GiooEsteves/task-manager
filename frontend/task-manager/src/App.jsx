import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import LandingPage from './pages/Landing/LandingPage';
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Dashboard from "./pages/Admin/Dashboard";
import ManageTasks from "./pages/Admin/ManageTasks";
import CreateTask from "./pages/Admin/CreateTask";
import ManageUsers from "./pages/Admin/ManageUsers";
import UserDashboard from "./pages/User/UserDashboard";
import MyTasks from "./pages/User/MyTasks";
import ViewTaskDetails from "./pages/User/ViewTaskDetails";

import PrivateRoute from './routes/PrivateRoute'
import UserProvider from "./context/userContext";

const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            {/* LANDING/DEFAULT ROUTE */}
            <Route path="/" element={<LandingPage/>}/>

            {/* AUTH ROUTES */}
            <Route path="/login" element={<Login/>}/>
            <Route path="/signUp" element={<SignUp/>}/>
            
            {/* ADMIN ROUTES */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<Dashboard/>}/>
              <Route path="/admin/tasks" element={<ManageTasks/>}/>
              <Route path="/admin/create-task" element={<CreateTask/>}/>
              <Route path="/admin/users" element={<ManageUsers/>}/>
            </Route>

            {/* USER ROUTES */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/user/dashboard" element={<UserDashboard/>}/>
              <Route path="/user/tasks" element={<MyTasks/>}/>
              <Route path="/user/task-details/:id" element={<ViewTaskDetails/>}/>
            </Route>
          </Routes>
        </Router>
      </div>
    </UserProvider>
  )
}

export default App