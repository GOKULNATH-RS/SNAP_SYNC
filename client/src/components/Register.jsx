import { useState } from 'react'
import { storage } from '../../firebase'
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage'
import { v4 } from 'uuid'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Register = () => {
  const initialFormState = {
    eventName: '',
    eventDescription: '',
    eventDate: '',
    eventTime: '',
    eventLocation: '',
    eventOrganizer: '',
    eventOrganizerPhone: '',
    eventOrganizerEmail: '',
    eventOrganizerWebsite: '',
    eventOrganizerSocialMedia: '',
    eventLogo: '',
    eventBanner: '',
    eventPhotos: []
  }
  const [logoUpload, setLogoUpload] = useState(null)
  const [bannerUpload, setBannerUpload] = useState(null)
  const [formData, setFormData] = useState(initialFormState)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const navigate = useNavigate()
  function handleUploadImage(imgUpload) {
    return new Promise((resolve) => {
      if (imgUpload === null) return
      let uploadRef = `checkImg/${imgUpload.name + v4()}`
      const ImageRef = ref(storage, uploadRef)

      uploadBytes(ImageRef, imgUpload).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          resolve(url)
        })
      })
    })
  }

  const handleRegister = async (e) => {
    console.log(logoUpload, bannerUpload)
    e.preventDefault()
    if (
      !formData.eventName ||
      !formData.eventDescription ||
      !formData.eventDate ||
      !formData.eventTime ||
      !formData.eventLocation ||
      !formData.eventOrganizer ||
      !formData.eventOrganizerPhone ||
      !formData.eventOrganizerEmail ||
      !formData.eventOrganizerWebsite ||
      !formData.eventOrganizerSocialMedia ||
      !logoUpload ||
      !bannerUpload
    ) {
      toast.warning('Please fill all the details!', {
        position: 'top-center',
        autoClose: 2000,
        closeOnClick: true,
        draggable: true
      })

      const logoDB = await handleUploadImage(logoUpload)
      const bannerDB = await handleUploadImage(bannerUpload)

      console.log(logoDB, bannerDB)

      fetch('http://localhost:5000/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          formData,
          logo: logoDB,
          banner: bannerDB
        })
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Success:', data)
          toast.success('Event Registered Successfully', {
            position: 'top-center',
            autoClose: 2000,
            closeOnClick: true,
            draggable: true
          })
          setFormData(initialFormState)
          navigate('/')
        })
        .catch((error) => {
          console.log('Error:', error)
          toast.error('Error Occurred', {
            position: 'top-center',
            autoClose: 2000,
            closeOnClick: true,
            draggable: true
          })
        })
    }
  }

  const formFields = [
    {
      label: 'Event Name',
      type: 'text',
      name: 'eventName',
      placeholder: 'Event Name',
      value: formData.eventName
    },
    {
      label: 'Event Description',
      type: 'textarea',
      name: 'eventDescription',
      placeholder: 'Event Description',
      value: formData.eventDescription
    },
    {
      label: 'Event Date',
      type: 'date',
      name: 'eventDate',
      placeholder: 'Event Date',
      value: formData.eventDate
    },
    {
      label: 'Event Time',
      type: 'time',
      name: 'eventTime',
      placeholder: 'Event Time',
      value: formData.eventTime
    },
    {
      label: 'Event Location',
      type: 'text',
      name: 'eventLocation',
      placeholder: 'Event Location',
      value: formData.eventLocation
    },
    {
      label: 'Event Organizer',
      type: 'text',
      name: 'eventOrganizer',
      placeholder: 'Event Organizer',
      value: formData.eventOrganizer
    },
    {
      label: 'Event Organizer Phone',
      type: 'number',
      name: 'eventOrganizerPhone',
      placeholder: 'Event Organizer Phone',
      value: formData.eventOrganizerPhone
    },
    {
      label: 'Event Organizer Email',
      type: 'text',
      name: 'eventOrganizerEmail',
      placeholder: 'Event Organizer Email',
      value: formData.eventOrganizerEmail
    },
    {
      label: 'Event Organizer Website',
      type: 'text',
      name: 'eventOrganizerWebsite',
      placeholder: 'Event Organizer Website',
      value: formData.eventOrganizerWebsite
    },
    {
      label: 'Event Organizer Social Media',
      type: 'text',
      name: 'eventOrganizerSocialMedia',
      placeholder: 'Event Organizer Social Media',
      value: formData.eventOrganizerSocialMedia
    }
  ]

  return (
    <div className='p-4 flex  flex-col gap-4'>
      <h1 className='h2-semibold my-4 text-center'>Register New Event</h1>
      <form className='flex flex-wrap ml-10'>
        {formFields.map((field, i) => (
          <div key={i}>
            <label className='flex flex-col pl-4 h3-semibold'>
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={field.value}
              onChange={handleChange}
              className='shadow-inner h-14 w-96 px-2 mb-5 p-4 bg-white rounded-xl m-2'
            />
          </div>
        ))}
        <div className='flex flex-col gap-3'>
          <label className='flex flex-col pl-4 h3-semibold'>
            Upload Event Logo
          </label>
          <input
            type='file'
            onChange={(e) => setLogoUpload(e.target.files[0])}
          />
        </div>
        <div className='flex flex-col gap-3'>
          <label className='flex flex-col pl-4 h3-semibold'>
            Upload Event Banner
          </label>
          <input
            type='file'
            onChange={(e) => setBannerUpload(e.target.files[0])}
          />
        </div>
      </form>

      <button
        onClick={handleRegister}
        className='p-2 px-4 border-[1px] h-14 rounded-xl flex font-semibold items-center text-center w-max ml-20 bg-dark-400 text-light-200'
      >
        Register Event
      </button>
      <ToastContainer />
    </div>
  )
}

export default Register
