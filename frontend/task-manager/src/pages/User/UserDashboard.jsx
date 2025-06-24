import { useUserAuth } from "../../hooks/useUserAuth"

const UserDashboard = () => {
  useUserAuth();
  return (
    <div>
      user dashboard
    </div>
  )
}

export default UserDashboard
