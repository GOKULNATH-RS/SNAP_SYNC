import { useState } from 'react'
import UploadFile from './UploadFile'

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

  const [formData, setFormData] = useState(initialFormState)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleRegister = () => {
    fetch('http://localhost:5000/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Success:', data)

        setFormData(initialFormState)
      })
      .catch((error) => {
        console.log('Error:', error)
      })
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
          <UploadFile
            setImage={(image) => setFormData({ ...formData, eventLogo: image })}
          />
        </div>
        <div className='flex flex-col gap-3'>
          <label className='flex flex-col pl-4 h3-semibold'>
            Upload Event Banner
          </label>
          <UploadFile
            setImage={(image) =>
              setFormData({ ...formData, eventBanner: image })
            }
          />
        </div>
      </form>

      <button
        onClick={handleRegister}
        className='p-2 px-4 border-[1px] h-14 rounded-xl flex font-semibold items-center text-center w-max ml-20 bg-dark-400 text-light-200'
      >
        Register Event
      </button>
    </div>
  )
}

export default Register
