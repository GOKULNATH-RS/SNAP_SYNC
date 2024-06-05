import { useState, useEffect } from 'react'
import img from '../assets/img/Img-placeholder.png'
import { useNavigate } from 'react-router-dom'

const AllEvents = () => {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])

  useEffect(() => {
    fetch('http://localhost:5000/get')
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((error) => console.log('Error fetching events:', error))
  }, [])

  const handleEventClick = (id) => {
    navigate(`/event/${id}`)
  }
  return (
    <div className='flex flex-col justify-center items-center'>
      <h1 className='text-center text-4xl text-dark-100 m-4 font-bold'>
        Explore!!!
      </h1>

      <div className=' flex gap-4 flex-wrap justify-around '>
        {events.map((event) => (
          <div
            key={event._id}
            onClick={() => handleEventClick(event._id)}
            className=' w-[300px] h-[300px] flex align-center justify-center rounded-xl mb-7 mt-5 cursor-pointer'
          >
            <div className='relative'>
              <img
                src={event.eventBanner || img}
                alt=''
                className='w-[300px] h-[300px] rounded-xl'
              />
              <h1 className='absolute bottom-3 left-3'>{event.eventName}</h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllEvents
