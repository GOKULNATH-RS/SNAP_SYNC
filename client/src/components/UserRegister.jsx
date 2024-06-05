import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, SetEmail] = useState('')
  const [username, SetUsername] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const formFields = [
    { label: 'Username', name: 'Username', setValue: SetUsername },
    { label: 'Email', email: 'Email', setValue: SetEmail },
    { label: 'Password', name: 'password', setValue: setPassword }
  ]

  const handleSignup = (e) => {
    e.preventDefault()
    console.log(username)
    console.log(email)
    console.log(password)
    if (!username || !email || !password) {
      alert('Please fill all the fields.')
      return
    }

    axios
      .post('http://localhost:5000/signup', { username, email, password })
      .then((result) => {
        console.log(result)
        if (result.data.message === 'Email already exists') {
          window.alert('Email already exists. Please use another email.')
        } else if (result.data.message === 'Username already exists') {
          window.alert('Username already exists. Please use another username.')
        } else if (result.data.message === 'User created successfully') {
          sessionStorage.setItem('userId', result.data.userId)
          console.log(result.data)
          navigate('/allevent')
        }
      })
      .catch((error) => {
        console.error(error)
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          window.alert(error.response.data.message)
        } else {
          window.alert('Something went wrong. Please try again later.')
        }
      })
  }

  return (
    <div className='min-h-screen m-10 p-4 flex items-center flex-col gap-4'>
      <h1 className='h2-semibold my-4 text-center'>Register As Organizer</h1>
      <form className='flex-center flex-col ml-10'>
        {formFields.map((field) => (
          <div key={field.name}>
            <label className='flex flex-col pl-4 h3-semibold'></label>

            <div key={field.email}>
              <label className='flex flex-col pl-4 h3-semibold'>
                {field.label}
              </label>

              <input
                type={field.name === 'password' ? 'password' : 'text'}
                id={field.name}
                name={field.name}
                onChange={(e) => field.setValue(e.target.value)}
                className='shadow-inner h-14 w-96 px-2 mb-5 p-4 bg-white rounded-xl m-2'
              />
            </div>
          </div>
        ))}
      </form>
      <button
        type='submit'
        className='p-2 px-4 border-[1px] h-14 rounded-xl flex font-semibold items-center text-center w-max ml-20 bg-dark-400 text-light-200'
        onClick={handleSignup}
      >
        Register
      </button>
    </div>
  )
}

export default Login
