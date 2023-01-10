import axios from 'axios'

export default function SignOutButton({setIsSignedIn, setUser}) {

  const handleSignOut = async (event) => {
    axios.post('handleSignout/')
    setIsSignedIn(false)
    setUser(null)
    location.reload()}

  return <input type='submit' value='Sign Out' onClick={handleSignOut} />}