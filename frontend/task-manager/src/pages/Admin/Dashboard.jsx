import { useUserAuth } from '../../hooks/useUserAuth'

const Dashboard = () => {
  useUserAuth();
  return (
    <div>
      dashboard
    </div>
  )
}

export default Dashboard
