import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Images from './Images'

import { storage } from '../../firebase'
import { ref, listAll, getDownloadURL, uploadBytes } from 'firebase/storage'

const EventPage = () => {
  const { id } = useParams() // Make sure the URL has an id parameter
  const [eventData, setEventData] = useState({}) // Initialize as an object
  const [showUpload, setShowUpload] = useState(false)
  const [images, setImages] = useState([])
  const [imageList, setImageList] = useState([])

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/get/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setEventData(data)
        })
        .catch((error) => console.log('Error fetching event data:', error))
    }
  }, [id]) // Add id as a dependency

  const uploadFiles = async (e) => {
    e.preventDefault()

    let imageData = []
    console.log('Started Uploading')

    for (let i = 0; i < images.length; ++i) {
      const imageName = `events/${images[i].name}`
      console.log(images[i].name)
      const imageRef = ref(storage, imageName)
      const result = await uploadBytes(imageRef, images[i]).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          let imgIndex = { imageName: imageName, imageUrl: url }
          imageData[i] = url
        })
      })
    }

    // fetch(`http://localhost:5000/upload/${id}`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ images: imageData })
    // })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log('Success:', data)
    //   })
    //   .catch((error) => {
    //     console.log('Error:', error)
    //   }
    // )

    setImageList(imageData)
    console.log('Image data', imageList)
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
        {/* <button
          className='btn mx-6 mt-10'
          onClick={setShowUpload((prev) => !prev)}
        >
          Upload Event Photos
        </button> */}

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
        <Images images={imageList} />
      </div>
    </div>
  )
}

export default EventPage
