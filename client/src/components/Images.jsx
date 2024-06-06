/* eslint-disable react/prop-types */
import Image from './Image'
import { saveAs } from 'file-saver'

import { useEffect, useState } from 'react'
const Images = (props) => {
  const [list, setList] = useState([])

  useEffect(() => {
    setList(props.array || props.images || [])
  }, [props])

  const handleDownload = (path) => {
    saveAs(path, 'image.jpg')
  }

  return (
    <div className='my-4 ml-10 p-3 px-14'>
      <h2 className=' h2-semibold text-center m-4 pb-14'>
        {props.title || 'Your Images'}
      </h2>
      <div className='flex flex-wrap gap-4'>
        {list.map((item, i) => {
          return (
            <div key={i} className='flex-center gap-1 flex-col'>
              <Image url={item} styles='h-72  rounded-xl' />
              {props.download && (
                <button className='btn' onClick={() => handleDownload(item)}>
                  Download
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Images
