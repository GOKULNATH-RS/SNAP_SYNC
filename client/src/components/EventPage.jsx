import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Images from './Images'

import { storage } from '../../firebase'
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage'

const EventPage = () => {
  const { id } = useParams() // Make sure the URL has an id parameter
  const [eventData, setEventData] = useState({}) // Initialize as an object
  const [showUpload, setShowUpload] = useState(false)
  const [images, setImages] = useState([])
  const [imgWebUrl, setImgWebUrl] = useState('')
  const [photos, setPhotos] = useState([])

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/get/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setEventData(data)

          const eventPhotos = data.eventPhotos
          console.log('eventData Photos', eventPhotos)
          eventPhotos.forEach((photo) => {
            console.log(photo)
            setPhotos((prev) => [...prev, photo.imageUrl])
          })
          console.log('photos', photos)
        })
        .catch((error) => console.log('Error fetching event data:', error))
    }
  }, [id]) // Add id as a dependency

  function add(listImgs, imageName, url) {
    return new Promise((resolve) => {
      listImgs.push({ imageName: imageName, imageUrl: url })
      resolve(listImgs)
    })
  }

  const uploadFiles = async (e) => {
    e.preventDefault()

    console.log('Started Uploading')
    console.log(images)

    let listImgs = []

    new Promise((resolve) => {
      for (let i = 0; i < images.length; i++) {
        const imageName = `${eventData._id}/${images[i].name}`

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
        <form className='flex flex-col gap-3 ml-10'>
          <label className='flex flex-col pl-4 h3-semibold'>
            Upload Event Photos
          </label>
          <input
            type='file'
            multiple
            onChange={(event) => {
              setImages(event.target.files)
            }}
          />
          <button
            className='btn mx-6 mt-10 w-max'
            onClick={(e) => uploadFiles(e)}
          >
            Upload Photos
          </button>
        </form>

        <Link to={`/getmyphotos/${id}`} className='btn mx-6 mt-10 w-max'>
          Get My Photos Photos
        </Link>
        <Images images={photos} />
      </div>
    </div>
  )
}

export default EventPage
