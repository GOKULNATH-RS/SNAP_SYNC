/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import UserForm from './components/UserForm'
import Images from './components/Images'

const GetMyPhotos = () => {
  const { id } = useParams()
  const [image, setImages] = useState([])
  const [fetchImg, setFetchImg] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    id: ''
  })
  const [matchUrl, setMatchUrl] = useState('')

  // useEffect(() => {
  //   const data =
  //     '"{"status":"success","input_image":"test1/test.JPG","message":"Face Detected!","images_found":2,"images":["test1/ABI02952.JPG","test1/test.JPG"],"images_not_found":["test1/ABI02759.JPG","test1/ABI02868.JPG","test1/ABI02872.JPG"]}\r\n"'

  //   const parsedData = JSON.parse(data)
  //   console.log('Parsed Data ', parsedData)
  // }, [])

  const handleVerify = () => {
    console.log('From GetMyPhotos ', image)
    console.log('Handle Verify Called')
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
        console.log('Data', imgData)
        getImageUrls(imgData)
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error)
      })
  }

  function getImageUrls(imgNames) {
    fetch(`http://localhost:5000/get/${id}`)
      .then((res) => res.json())
      .then((data) => {
        let matchingUrls = []

        console.log('EventPhotos ', data.eventPhotos)
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
      <UserForm setImages={setImages} setFormData={setFormData} />

      <button className='btn  mt-8' onClick={handleVerify}>
        Find My Photos
      </button>
      <Images download array={matchUrl} />
    </div>
  )
}

export default GetMyPhotos
