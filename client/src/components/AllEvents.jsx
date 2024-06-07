import { useState, useEffect } from 'react'
import img from '../assets/img/Img-placeholder.png'
import { useNavigate } from 'react-router-dom'

const AllEvents = () => {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])

  const userId = sessionStorage.getItem('userId')

  useEffect(() => {
    fetch(`http://localhost:5000/get/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setEvents(data)
      })
      .catch((error) => {
        console.log('user under if', userId)
        if (!userId) {
          return <p>User is not Authenticated</p>
        }
        console.log('Error fetching events:', error)
      })
  }, [])

  const handleEventClick = (id) => {
    navigate(`/event/${id}`)
  }
  return (
    <div className='flex flex-col justify-center items-center'>
      <h1 className='text-center text-4xl text-dark-400 my-8 font-bold'>
        Explore Events
      </h1>

      <div className=' flex gap-4 flex-wrap justify-around '>
        {userId ? (
          events.map((event) => (
            <div
              key={event._id}
              onClick={() => handleEventClick(event._id)}
              className=' w-[300px] h-[300px] flex align-center justify-center rounded-xl mb-7 mt-5 cursor-pointer shadow-md bg-light-200 hover:shadow-xl transition duration-300 ease-in-out'
            >
              <div className='relative'>
                <img
                  src={event.eventLogo || img}
                  alt=''
                  className='w-[300px] h-[300px] rounded-xl '
                />

                <div className='absolute bottom-0 left-0 p-3 pt-6 w-full font-semibold text-white bg-gradient-to-t from-[rgba(0,0,0,0.55)] to-[rgba(0,0,0,0)] rounded-lg'>
                  <p className='text-lg z-10'>{event.eventName}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <>
            <p>Not Authenticated</p>
          </>
        )}
      </div>
    </div>
  )
}

export default AllEvents
