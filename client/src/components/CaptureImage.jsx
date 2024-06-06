/* eslint-disable react/prop-types */
import { useState, useRef, useCallback } from 'react'
import Webcam from 'react-webcam'
import img from '../assets/img/Img-placeholder.png'
import { v4 } from 'uuid'
import { storage } from '../../firebase'

import { ref, getDownloadURL, uploadString } from 'firebase/storage'

const videoConstraints = {
  width: 1280 / 3,
  height: 720 / 3,
  facingMode: 'user'
}

const CaptureImage = ({ setImage }) => {
  const webcamRef = useRef(null)
  const [imgSrc, setImgSrc] = useState(img)
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot()
    console.log('Captured Image ', imageSrc)
    setImgSrc(imageSrc)
    handleUpload(imageSrc)
  }, [webcamRef])

  const handleUpload = (imageBase64) => {
    console.log('Uploading image', imageBase64)
    if (imageBase64 === null) return
    let uploadRef = `checkImg/${v4()}`
    const ImageRef = ref(storage, uploadRef)

    uploadString(ImageRef, imageBase64, 'data_url').then((snapshot) => {
      console.log('Uploaded a blob or file!', snapshot)
      getDownloadURL(snapshot.ref).then((url) => {
        console.log('URL ', url)
        setImage(uploadRef)
        console.log('From capture', uploadRef)
      })
    })
  }

  return (
    <div className='flex-center gap-2 flex-col'>
      <div className='flex flex-gap p-4 gap-3'>
        <Webcam
          audio={false}
          ref={webcamRef}
          className='rounded-xl'
          screenshotFormat='image/jpeg'
          videoConstraints={videoConstraints}
        />
        {imgSrc && (
          <img
            className={`h-${720 / 3} w-${1280 / 3} rounded-xl `}
            src={imgSrc}
          />
        )}
      </div>

      <button
        onClick={capture}
        className=' m-2 bg-dark-200 h-10 text-white flex-center rounded-xl p-4 w-max '
      >
        Capture photo
      </button>
    </div>
  )
}

export default CaptureImage
