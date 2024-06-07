import { Link } from 'react-router-dom'

const NavBar = () => {
  const userId = sessionStorage.getItem('userId')
  console.log('User from nav', userId)

  function handleLogout() {
    sessionStorage.setItem('userId', null)
  }

  return (
    <header className='text-light-200 bg-dark-300 flex-between shadow-xl p-4 h-20'>
      <Link to={'/allevent'} className='h2-bold'>
        <span className='text-[#ffd223]'>Snap</span> Sync
      </Link>

      {/* <nav>
        <a href="body-regular"></a>
        <a href=""></a>
        <a href=""></a>
      </nav> */}
      <nav>
        <div className='flex-center gap-3'>
          {!userId && (
            <Link to='/' className='body-regular'>
              Login as Organizer
            </Link>
          )}
          {userId && (
            <>
              <Link to='/register' className='body-regular'>
                Register New Event
              </Link>
              <Link to={'/'} onClick={handleLogout}>
                Logout
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

export default NavBar
