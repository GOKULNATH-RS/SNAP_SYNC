const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { exec } = require('child_process')
const mongoose = require('mongoose')
const eventmodel = require('./Models/schema')
const Event = require('./Models/schema')
const User = require('./Models/user')

const app = express()

app.use(bodyParser.json())
app.use(cors())

const callPython = (path1, path2) => {
  return new Promise((resolve, reject) => {
    console.log('Inside Promise with path1 ', path1, ' and path2 ', path2)
    exec(`python index2.py ${path1} ${path2}`, (error, stdout, stderr) => {
      if (error) {
        console.log(error)
        reject(error)
        return
      }
      if (stderr) {
        console.log(stderr)
        reject(new Error(stderr))
        return
      }
      console.log('StdOut : ', stdout)
      resolve(stdout)
    })
  })
}

async function connecttodb() {
  try {
    const url =
      'mongodb+srv://1234:snapsync@cluster0.fyuumae.mongodb.net/SnapSync?retryWrites=true&w=majority&appName=Cluster0'
    await mongoose.connect(url)
    console.log('connected to database successfully')
    const port = process.env.PORT || 5000
    app.listen(port, function () {
      console.log('server started at 5000....')
    })
  } catch (error) {
    console.log('cannot connect to database')
    console.log(error)
  }
}
connecttodb()

app.get('/', (req, res) => {
  res.send('Images')
})

app.post('/uploadImage', (req, res) => {
  const image = req.body.image
  console.log('Image ', image)
  if (!image) {
    res.status(400).send('Image not found')
  } else {
    res.send('Image Uploaded Successfully')
  }
})

app.delete('/deleteImage', (req, res) => {
  const image = req.body.image
  console.log('Image ', image)
  res.send('Image Deleted Successfully')
})

app.post('/fetchImages', async (req, res) => {
  console.log('Request Body ', req.body)
  const userImage = req.body.userImage
  const ImageFolder = req.body.imageList
  try {
    const result = await callPython(userImage, ImageFolder)
    console.log('Result \n ', result)
    const responseData = { status: 'success', images: result }
    res.status(200).send(responseData)
  } catch (error) {
    res
      .status(500)
      .send({ status: 'error', message: 'came from here', error: error })
  }
})

app.post('/create', async function (req, res) {
  try {
    const {
      eventName,
      eventDescription,
      eventDate,
      eventTime,
      eventLocation,
      eventOrganizer,
      eventOrganizerPhone,
      eventOrganizerEmail,
      eventOrganizerWebsite,
      eventOrganizerSocialMedia,
      eventBanner,
      eventLogo,
      eventPhotos
    } = req.body.formData

    const newEvent = new Event({
      eventName,
      eventDescription,
      eventDate,
      eventTime,
      eventLocation,
      eventOrganizer,
      eventOrganizerPhone,
      eventOrganizerEmail,
      eventOrganizerWebsite,
      eventOrganizerSocialMedia,
      eventBanner,
      eventLogo,
      eventPhotos,
      eventLogo: req.body.logo,
      eventBanner: req.body.banner,
      userId: req.body.userId
    })
    await newEvent.save()
    res.status(200).send({
      status: 'success',
      message: 'Event created successfully',
      newEvent
    })
  } catch (error) {
    res.status(400).json({ status: 'failed', message: 'cannot create task' })
    console.log(error)
  }
})

app.post('/uploadeventphotos/:id', async function (req, res) {
  try {
    const { images } = req.body
    const { id } = req.params
    const event = await Event.findByIdAndUpdate(
      { _id: id },
      { $push: { eventPhotos: { $each: images } } },
      { new: true }
    )
    res
      .status(200)
      .send({ status: 'success', message: 'Photos uploaded successfully' })
  } catch (error) {
    res.status(400).json({ status: 'failed', message: 'cannot upload photos' })
    console.log(error)
  }
})

app.get('/get/:userId', async function (req, res) {
  const userId = req.params.userId
  try {
    const events = await eventmodel.find({ userId })
    res.status(200).send(events)
  } catch (error) {
    res.status(400).json({ status: 'failed', message: 'cannot get task' })
    console.log(error)
  }
})

app.get('/getevents/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    res.status(200).send(event)
  } catch (error) {
    res.status(400).json({ status: 'failed', message: 'cannot get event' })
    console.log(error)
  }
})

//Create-Account
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body
  if (!username || !email || !password) {
    return res.status(400).send({ message: 'All fields are required' })
  }
  User.findOne({ $or: [{ name: username }, { email: email }] })
    .then((existingUser) => {
      if (existingUser) {
        if (existingUser.email === email) {
          res.status(400).json({ message: 'Email already exists' })
        } else {
          res.status(400).json({ message: 'Username already exists' })
        }
      } else {
        User.create({ username, email, password })
          .then((user) => {
            res
              .status(201)
              .json({ message: 'User created successfully', userId: user._id })
          })
          .catch((err) => res.status(500).json({ message: err.message }))
      }
    })
    .catch((err) => res.status(500).json({ message: err.message }))
})

// login
app.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email, password })
    if (user) {
      res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
        message: 'User logged in successfully'
      })
    } else {
      res.status(401).json({
        message: 'Incorrect username or password'
      })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})
