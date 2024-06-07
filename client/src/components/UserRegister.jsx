import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const UserRegister = () => {
  const [email, SetEmail] = useState('')
  const [username, SetUsername] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const formFields = [
    { label: 'Username', name: 'Username', setValue: SetUsername },
    { label: 'Email', name: 'Email', setValue: SetEmail },
    { label: 'Password', name: 'password', setValue: setPassword }
  ]

  const handleSignup = async (e) => {
    console.log('button clicked')
    e.preventDefault()

    if (!username || !email || !password) {
      toast.warning('Please fill all the details!', {
        position: 'top-center',
        autoClose: 2000,
        closeOnClick: true,
        draggable: true
      })
      return
    }
    try {
      const response = await axios.post('http://localhost:5000/signup', {
        username,
        email,
        password
      })

      const result = response.data
      console.log(response.data.message)
      console.log(result.message)
      if (result.message === 'Email already exists') {
        toast.error('Email already exists!', {
          position: 'top-center',
          autoClose: 2000,
          closeOnClick: true,
          draggable: true
        })
      } else if (result.message === 'Username already exists') {
        toast.error('Email already exists!', {
          position: 'top-center',
          autoClose: 2000,
          closeOnClick: true,
          draggable: true
        })
      } else if (result.message === 'User created successfully') {
        toast.success('User Created', {
          position: 'top-scenter',
          autoClose: 2000,
          closeOnClick: true,
          draggable: true
        })
        sessionStorage.setItem('userId', result.userId)
        console.log('Session user Id ')
        navigate('/register')
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message, {
        position: 'top-center',
        autoClose: 2000,
        closeOnClick: true,
        draggable: true
      })
    }
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
      <ToastContainer />
    </div>
  )
}

export default UserRegister
