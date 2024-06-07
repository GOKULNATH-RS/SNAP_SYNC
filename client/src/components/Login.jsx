import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const formFields = [
    { label: 'Email', name: 'email', setValue: setEmail },
    { label: 'Password', name: 'password', setValue: setPassword }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (!email && !password) {
        toast.warning('Please fill all the details!', {
          position: 'top-center',
          autoClose: 2000,
          closeOnClick: true,
          draggable: true
        })
        return
      } else if (!email) {
        toast.warning('Please fill the email!', {
          position: 'top-center',
          autoClose: 2000,
          closeOnClick: true,
          draggable: true
        })
        return
      } else if (!password) {
        toast.warning('Please fill the password!', {
          position: 'top-center',
          autoClose: 2000,
          closeOnClick: true,
          draggable: true
        })
        return
      }

      const response = await axios.post('http://localhost:5000/login', {
        email,
        password
      })
      const userdata = response.data
      if (userdata && userdata.id) {
        sessionStorage.setItem('userId', userdata.id)
        console.log('logged in successfully')
        console.log(userdata)

        navigate('/allevent')
      }
    } catch (error) {
      console.error('error occurred during login', error)
      toast.error('Invalid username or password!', {
        position: 'top-center',
        autoClose: 2000,
        closeOnClick: true,
        draggable: true
      })
    }
  }

  return (
    <div className='min-h-screen m-10 p-4 flex items-center flex-col gap-4'>
      <h1 className='h2-semibold my-4 text-center'>Login As Organizer</h1>
      <form className='flex-center flex-col ml-10' onSubmit={handleSubmit}>
        {formFields.map((field) => (
          <div key={field.name}>
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
        ))}
        <button
          type='submit'
          className='p-2 px-4 border-[1px] h-14 rounded-xl flex font-semibold items-center text-center w-max ml-10 bg-dark-400 text-light-200'
        >
          Login To Explore
        </button>
      </form>
      <div className='flex flex-col text-center'>
        <h1 className='text-xl text-dark-200 font-semibold text-center ml-14 mb-4'>
          or
        </h1>
        <Link to='/userregister'>
          <button className='p-2 px-4 border-[1px] h-14 rounded-xl flex font-semibold items-center text-center w-max ml-20 bg-dark-400 text-light-200'>
            New User
          </button>
        </Link>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Login
