
import { useUserInfo } from 'context/user'
import localforage from 'localforage'
import { useNavigate } from 'react-router-dom'

function useAuth() {
  const [user] = useUserInfo()
  return user?.token
}

function useLogout() {
  const clear    = useUserInfo()[2]
  const navigate = useNavigate()

  return () => {
    localforage.clear()
    clear()
    navigate('/auth/sign-in')
  }
}

export { useAuth, useLogout }
