import axios from 'axios'

export default function Welcome({setIsSignedIn, setUser}) {

  const signUp = async (event) => {
    event.preventDefault()
    const userEmail = document.getElementById('userEmail').value
    const userPassword = document.getElementById('userPassword').value
    const response = await axios.post('signup/', {
      'userEmail': userEmail,
      'userPassword': userPassword,})
    if (response.data.success == false) {
      if (response.data.error && response.data.error.includes('duplicate key')) {
        window.alert('That user is already registered. Sign in or register with a different email address.')}
      else if (response.data.error) {
        window.alert('Unable to sign you up at this time. Try again in a few moments.')
      }}
    else {
      setIsSignedIn(true)
      setUser(userEmail)}}

  const signIn = async (event) => {
    event.preventDefault()
    const userEmail = document.getElementById('userEmail').value
    const userPassword = document.getElementById('userPassword').value
    const response = await axios.post('signin/', {
      'userEmail': userEmail,
      'userPassword': userPassword,})
    if (response.data.success == false) {
      console.log(response.data.error)
      window.alert('Unable to authenticate user. Verify that the email address and password are correct.')}
    else {
      setIsSignedIn(true)
      setUser(userEmail)}}

  return(
    <center>
      <input placeholder='Email address' id='userEmail' style={{width:'210px'}}/><br />
      <input placeholder='Password' id='userPassword' type='password' style={{width:'210px'}} /><br />
    <input type='submit' value='Sign In' onClick={signIn} style={{width:'103px'}} />&nbsp;<input type='submit' value='Sign Up' onClick={signUp} style={{width:'103px'}} />
    </center>
  )

}