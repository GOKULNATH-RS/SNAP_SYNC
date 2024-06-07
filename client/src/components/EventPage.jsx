import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Images from './Images'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { storage } from '../../firebase'
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage'

const EventPage = () => {
  const { id } = useParams()
  const [eventData, setEventData] = useState({})
  const [images, setImages] = useState([])
  const [photos, setPhotos] = useState([])

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/get/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setEventData(data)

          const eventPhotos = data.eventPhotos
          eventPhotos.forEach((photo) => {
            setPhotos((prev) => [...prev, photo.imageUrl])
          })
        })
        .catch((error) => console.log('Error fetching event data:', error))
    }
  }, [id])
  function add(listImgs, imageName, url) {
    return new Promise((resolve) => {
      listImgs.push({ imageName: imageName, imageUrl: url })
      resolve(listImgs)
    })
  }

  const uploadFiles = async (e) => {
    e.preventDefault()

    if (images.length === 0)
      return toast.error('Please select images to upload', {
        position: 'top-center',
        autoClose: 2000,
        closeOnClick: true,
        draggable: true
      })

    console.log('Started Uploading')
    console.log(images)
    const uploadToastId = toast.loading(`Uploading ${images.length} Photos`, {
      position: 'top-center',
      closeOnClick: true,
      draggable: true
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
      .then((data) => {
        console.log('Success:', data)
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
        <p className='body-regular px-12 '>{eventData.eventDescription}</p>
        <div className='m-4 p-2 h2-semibold flex-between'>
          <p className='m-2'>{eventData.eventDate}</p>
          <p className='m-2'>{eventData.eventLocation}</p>
        </div>
        <div className='m-4 p-2 h2-semibold flex-between'>
          <p className='m-2'>{eventData.eventOrganizer}</p>
          <p className='m-2'>{eventData.eventOrganizerEmail}</p>
          <p className='m-2'>{eventData.eventOrganizerWebsite}</p>
        </div>
      </div>
      <div>
        <form className='flex flex-col gap-3 mx-4'>
          <label className='flex flex-col h3-semibold'>
            Upload Event Photos
          </label>
          <div className=' flex gap-0 items-center'>
            <input
              type='file'
              multiple
              onChange={(event) => {
                setImages(event.target.files)
              }}
            />

            <button className='btn w-max' onClick={(e) => uploadFiles(e)}>
              Upload Photos
              <ToastContainer />
            </button>
          </div>
        </form>

        <Link to={`/getmyphotos/${id}`} className='btn mx-6 mt-10 w-max'>
          Get My Photos
        </Link>
        <Images images={photos} title={'Event Photos'} />
      </div>
    </div>
  )
}

export default EventPage
