/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import UserForm from './components/UserForm'
import Images from './components/Images'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const GetMyPhotos = () => {
  const { id } = useParams()
  const [image, setImages] = useState([])
  const [fetchImg, setFetchImg] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    id: ''
  })
  const [matchUrl, setMatchUrl] = useState(null)
  const [closeUpdateToast, setCloseUpdateToast] = useState(false)
  const [loading, setLoading] = useState(false)

  // useEffect(() => {
  //   const data =
  //     '"{"status":"success","input_image":"test1/test.JPG","message":"Face Detected!","images_found":2,"images":["test1/ABI02952.JPG","test1/test.JPG"],"images_not_found":["test1/ABI02759.JPG","test1/ABI02868.JPG","test1/ABI02872.JPG"]}\r\n"'

  //   const parsedData = JSON.parse(data)
  //   console.log('Parsed Data ', parsedData)
  // }, [])

  const handleVerify = () => {
    console.log('From GetMyPhotos ', image)
    console.log('Handle Verify Called')
    setLoading(true)

    // const msgs = [
    //   'Matching in Progress, Please wait...',
    //   'Almost there, Please wait a bit longer...',
    //   'Just a few more seconds...',
    //   'Almost done...'
    // ]
    // let i = 0

    // const toaster = toast.loading(msgs[i], {
    //   position: 'top-right',
    //   autoClose: 2000,
    //   closeOnClick: true,
    //   draggable: true
    // })

    // setInterval(() => {
    //   i = (i + 1) % msgs.length
    //   toast.update(toaster, {
    //     render: msgs[i],
    //     type: 'info',
    //     isLoading: true,
    //     draggable: true
    //   })
    // }, 5000)

    fetch(`http://localhost:5000/fetchImages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userImage: image,
        imageList: `${id}/`
      })
    })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        const imgData = data.images.slice(0, data.images.length - 2).split('$')
        setImages(imgData)
        clearInterval()
        console.log('Data', imgData)
        getImageUrls(imgData)
        // toast.update(toaster, {
        //   render: 'Images Found!',
        //   type: 'success',
        //   isLoading: false,
        //   autoClose: 2000,
        //   closeOnClick: true,
        //   draggable: true
        // })
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error)
        toast.error('Error Occurred', {
          position: 'top-center',
          autoClose: 2000,
          closeOnClick: true,
          draggable: true
        })
      })
  }

  function getImageUrls(imgNames) {
    fetch(`http://localhost:5000/getevents/${id}`)
      .then((res) => res.json())
      .then((data) => {
        let matchingUrls = []

        console.log('EventPhotos ', data)
        for (let img in imgNames) {
          for (let i = 0; i < data.eventPhotos.length; i++) {
            console.log('Image ', imgNames[img])
            console.log('Data ', data.eventPhotos[i].imageName)
            if (imgNames[img] === data.eventPhotos[i].imageName) {
              console.log('Matched')
              console.log(imgNames[img], data.eventPhotos[i].imageName)
              matchingUrls.push(data.eventPhotos[i].imageUrl)
            }
          }
        }
        console.log(matchingUrls)
        setMatchUrl(matchingUrls)
      })
      .catch((error) => console.log('Error fetching event data:', error))
  }

  return (
    <div className='w-full flex flex-col items-center'>
      <h1 className='h1-bold m-4 text-center pt-10'>
        Get Your Images Instantly
      </h1>
      <UserForm
        setImages={setImages}
        position={'top-right'}
        setFormData={setFormData}
      />

      <button className='btn m-8' onClick={handleVerify}>
        Find My Photos
      </button>
      <ToastContainer />
      {matchUrl ? (
        <Images download array={matchUrl} />
      ) : (
        loading && (
          <div className='flex flex-col gap-6 items-center justify-center h-screen'>
            <div className='relative'>
              <div className='h-24 w-24 rounded-full border-t-8 border-b-8 border-dark-200'></div>
              <div className='absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-[#fedb4b] animate-spin'></div>
            </div>
            <p>Matching</p>
          </div>
        )
      )}
    </div>
  )
}

export default GetMyPhotos
