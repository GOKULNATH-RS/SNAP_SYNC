import loadGif from '../assets/icons/loading-gif.gif'
// eslint-disable-next-line react/prop-types
const Loading = ({ size, text, success }) => {
  return (
    <div className='flex gap-2 items-center'>
      {success ? (
        <p>✅</p>
      ) : (
        <img src={loadGif} alt='loading' className={`h-${size}`} />
      )}
      <p className='body-regular'>{text}</p>
    </div>
  )
}

export default Loading
