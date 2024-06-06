/* eslint-disable react/prop-types */

import { useState } from 'react'
import { storage } from '../../firebase'
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage'
import { v4 } from 'uuid'

/* eslint-disable no-unused-vars */
const UploadFile = ({ setImage }) => {
  const [imgUpload, setImgUpload] = useState(null)
  const [imageList, setImageList] = useState([])
  const [userInputImage, setUserInputImage] = useState(null)

  const imageFolderRef = ref(storage, 'images/')

  const handleUpload = () => {
    console.log('Uploading image', imgUpload)
    if (imgUpload === null) return
    let uploadRefNotClean = `checkImg/${imgUpload.name + v4()}`
    const uploadRef = uploadRefNotClean.replace(/\s/g, '')
    console.log('Uploading image', imgUpload.name)
    const ImageRef = ref(storage, uploadRef)

    uploadBytes(ImageRef, imgUpload).then((snapshot) => {
      console.log('Uploaded a blob or file!', snapshot)
      getDownloadURL(snapshot.ref).then((url) => {
        setUserInputImage(url)
        setImage(uploadRef)
        console.log('From Upload', uploadRef)
      })
    })
  }

  return (
    <div className='max-w-2xl mx-auto p-4 flex gap-4 items-end'>
      <div>
        <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
          Upload file
        </label>
        <input
          className='block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400'
          id='file_input'
          type='file'
          accept='image/*'
          onChange={(e) => {
            setImgUpload(e.target.files[0])
          }}
        />
      </div>

      <button
        className='btn-primary bg-dark-300 text-white p-1 rounded-xl'
        onClick={handleUpload}
      >
        Upload Image
      </button>
    </div>
  )
}

export default UploadFile
