/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'

import UserForm from './components/UserForm'
import Images from './components/Images'

const GetMyPhotos = () => {
  const [image, setImages] = useState([])
  const [fetchImg, setFetchImg] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    id: ''
  })

  // useEffect(() => {
  //   const data =
  //     '"{"status":"success","input_image":"test1/test.JPG","message":"Face Detected!","images_found":2,"images":["test1/ABI02952.JPG","test1/test.JPG"],"images_not_found":["test1/ABI02759.JPG","test1/ABI02868.JPG","test1/ABI02872.JPG"]}\r\n"'

  //   const parsedData = JSON.parse(data)
  //   console.log('Parsed Data ', parsedData)
  // }, [])

  const handleVerify = () => {
    console.log('Handle Verify Called')
    fetch(`http://localhost:5000/fetchImages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userImage: formData.name,
        imageList: formData.id
      })
    })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        const imgData = data.images.slice(0, data.images.length - 2).split('$')
        setImages(imgData)
        console.log('Image ', imgData)
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error)
      })
  }

  return (
    <div>
      <h1 className='h1-bold m-4 text-center pt-10'>
        Get Your Images Instantly
      </h1>
      <UserForm setImages={setImages} setFormData={setFormData} />
      <Images download array={image} />

      <button
        className='bg-dark-200 h-10 text-white rounded-xl p-4 m-4'
        onClick={handleVerify}
      >
        Verify
      </button>
    </div>
  )
}

export default GetMyPhotos
