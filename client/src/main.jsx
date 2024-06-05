import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import GetMyPhotos from './GetMyPhotos.jsx'
import Register from './components/Register.jsx'
import Login from './components/Login.jsx'
import AllEvents from './components/AllEvents.jsx'
import UserRegister from './components/UserRegister.jsx'
import EventPage from './components/EventPage.jsx'

import './index.css'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <AllEvents />
      },
      {
        path: '/getmyphotos/:id',
        element: <GetMyPhotos />
      },
      {
        path: '/register',
        element: <Register />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/event/:id',
        element: <EventPage />
      },
      {
        path: '/allevent',
        element: <AllEvents />
      },
      {
        path: '/userregister',
        element: <UserRegister />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={appRouter} />
)
