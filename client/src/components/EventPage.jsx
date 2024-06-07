import { useEffect, useState, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import Images from './Images'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import QRCode from 'qrcode.react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import logo from '../assets/logoBg.png'
import link from '../assets/icons/link.svg'
import location from '../assets/icons/location.svg'
import mail from '../assets/icons/mail.svg'
import date from '../assets/icons/round-date-range.svg'
import organizer from '../assets/icons/person.svg'

import { storage } from '../../firebase'
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage'

const EventPage = () => {
  const { id } = useParams()
  const [eventData, setEventData] = useState({})
  const [images, setImages] = useState([])
  const [photos, setPhotos] = useState([])
  const [updatePhotos, setUpdatePhotos] = useState(false)
  const [textToCopy, setTextToCopy] = useState('') // The text you want to copy
  const [copyStatus, setCopyStatus] = useState(false) // To indicate if the text was copied

  const canvasRef = useRef()

  const getEventDetailsUrl = () => {
    return `${window.location.origin}/event/${id}`
  }

  const userId = sessionStorage.getItem('userId')
  console.log('User Id ', userId)

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/getevents/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setEventData(data)
          setPhotos([])
          const eventPhotos = data.eventPhotos
          eventPhotos.forEach((photo) => {
            setPhotos((prev) => [...prev, photo.imageUrl])
          })
        })
        .catch((error) => console.log('Error fetching event data:', error))
    }
  }, [id, updatePhotos])
  function add(listImgs, imageName, url) {
    return new Promise((resolve) => {
      listImgs.push({ imageName: imageName, imageUrl: url })
      resolve(listImgs)
    })
  }

  const onCopyHandler = (text) => {
    setTextToCopy(text)
    setCopyStatus(true)
    setTimeout(() => setCopyStatus(false), 2500) // Hide the success message after 2.5 seconds
  }

  const downloadPNG = () => {
    const canvas = canvasRef.current.querySelector('canvas')
    const pngUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = pngUrl
    link.download = `${eventData.eventName}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const uploadFiles = async (e) => {
    e.preventDefault()

    if (images.length === 0)
      return toast.error('Please select images to upload', {
        position: 'top-center',
        autoClose: 2000,
        closeOnClick: true,
        draggable: false
      })

    console.log('Started Uploading')
    console.log(images)
    const uploadToastId = toast.loading(`Uploading ${images.length} Photos`, {
      position: 'top-center',
      closeOnClick: true,
      draggable: false
    })

    let listImgs = []

    new Promise((resolve) => {
      for (let i = 0; i < images.length; i++) {
        const imageNameNotClean = `${eventData._id}/${images[i].name}`
        const imageName = imageNameNotClean.replace(/\s/g, '')

        const imageRef = ref(storage, imageName)
        uploadBytes(imageRef, images[i]).then((snapshot) => {
          getDownloadURL(snapshot.ref).then(async (url) => {
            add(listImgs, imageName, url).then(() => {
              console.log('Uploaded Length ', listImgs.length)
              if (images.length === listImgs.length) {
                console.log('Resolved')
                resolve(listImgs)
              }
            })
          })
        })
      }
    }).then((data) => {
      toast.update(uploadToastId, {
        toastId: 'upload-file-toast',
        render: 'Image uploaded successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
        draggable: true
      })
      updateToDB(data)
    })
  }

  function updateToDB(imagesForDB) {
    console.log('Images List for Server', imagesForDB)
    fetch(`http://localhost:5000/uploadeventphotos/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ images: imagesForDB })
    })
      .then((res) => {
        res.json()
      })
      .then(() => {
        console.log('Success:')
        setUpdatePhotos((prev) => !prev)
      })
      .catch((error) => {
        console.log('Error:', error)
      })
  }

  return (
    <div>
      <div className='w-full h-64 relative '>
        <img
          src={eventData.eventBanner}
          alt='Banner'
          className='w-full h-full bg-cover '
        />
        <img
          src={eventData.eventLogo}
          alt='Logo'
          className='w-40 h-40 absolute left-10 top-10 border-[1px] rounded-xl z-10'
        />
        <div className='absolute top-0 left-0 bg-gradient-to-t from-[rgba(0,0,0,0.4)] to-[rgba(0,0,0,0.1)] h-full w-full'></div>
      </div>
      <div>
        <h1 className='h1-bold m-4 p-2'>{eventData.eventName}</h1>
        <p className='paragraph-regular px-12 '>{eventData.eventDescription}</p>
        <div className='m-4 p-2 flex-between flex-wrap body-medium'>
          <p className='m-2 flex items-center gap-2'>
            <img src={date} alt='' />
            {eventData.eventDate}
          </p>
          <p className='m-2 flex items-center gap-2'>
            <img src={location} alt='' />
            {eventData.eventLocation}
          </p>
          <p className='m-2 flex items-center gap-2'>
            <img src={organizer} alt='' /> {eventData.eventOrganizer}
          </p>
          <p className='m-2 flex items-center gap-2'>
            <img src={mail} alt='' /> {eventData.eventOrganizerEmail}
          </p>
          <p className='m-2 flex items-center gap-2'>
            <img src={link} alt='' /> {eventData.eventOrganizerWebsite}
          </p>
        </div>
      </div>
      <div>
        {userId && (
          <div className='flex justify-around items-center '>
            <form className='flex flex-col gap-3 mx-4 '>
              <label className='flex flex-col h3-semibold'>
                Upload Event Photos
              </label>
              <div className=' flex flex-col gap-2 w-[500px] items-center'>
                <div className='flex items-center justify-center w-full'>
                  <label
                    htmlFor='dropzone-file'
                    className='flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600'
                  >
                    <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                      <svg
                        className='w-8 h-8 mb-1 text-gray-500 dark:text-gray-400'
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 20 16'
                      >
                        <path
                          stroke='currentColor'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
                        />
                      </svg>
                      <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
                        <span className='font-semibold'>
                          {images.length == 0
                            ? 'Click to upload'
                            : `${images.length} ${
                                images.length > 1 ? 'images' : 'image'
                              } choosen`}
                        </span>
                      </p>
                    </div>
                    <input
                      id='dropzone-file'
                      type='file'
                      multiple
                      onChange={(event) => {
                        setImages(event.target.files)
                      }}
                      className='hidden'
                    />
                  </label>
                </div>
                <button
                  className='px-2 py-1 border-[1px] rounded-xl my-2'
                  onClick={(e) => uploadFiles(e)}
                >
                  Upload Photos
                </button>
                <ToastContainer />
              </div>
            </form>

            <div className='mt-4'>
              <h3 className='h3-semibold mb-2 pl-4'>Share Event Details:</h3>
              <div ref={canvasRef} className='rounded-xl overflow-hidden'>
                <QRCode
                  value={getEventDetailsUrl()}
                  size={300}
                  bgColor='#ffffff'
                  includeMargin={true}
                  className='mx-4'
                  // imageSettings={{
                  //   src: logo,
                  //   width: 80,
                  //   height: 60,

                  // }}
                  style={{ borderRadius: '10px' }}
                />
              </div>

              <div className='mt-2 pl-4'>
                <div className=''>
                  <strong>Event URL:</strong>
                  <a
                    href={getEventDetailsUrl()}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='m-2 text-[#0000EE] underline'
                  >
                    Link
                  </a>
                </div>
                <div className='flex gap-2 items-center'>
                  <CopyToClipboard
                    text={textToCopy}
                    onCopy={() => {
                      onCopyHandler(getEventDetailsUrl())
                    }}
                  >
                    <button className='px-2 py-1 border-[1px] rounded-xl my-2'>
                      Copy to Clipboard
                    </button>
                  </CopyToClipboard>
                  {copyStatus && (
                    <div className='alert-success'>✅ Copied to clipboard!</div>
                  )}
                </div>

                <button
                  onClick={downloadPNG}
                  className='px-2 py-1 border-[1px] rounded-xl my-2'
                >
                  Download QR Code
                </button>
              </div>
            </div>
          </div>
        )}

        <div className='w-full  flex justify-center'>
          <Link
            to={`/getmyphotos/${id}`}
            className='btn mx-6 m-10 w-max flex justify-center '
          >
            Get My Photos
          </Link>
        </div>
        <Images images={photos} title={'Event Photos'} />
      </div>
    </div>
  )
}

export default EventPage
