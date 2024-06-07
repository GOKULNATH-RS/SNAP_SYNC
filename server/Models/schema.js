const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  eventName: {
    type: String
  },
  eventDescription: {
    type: String
  },
  eventDate: {
    type: String
  },
  eventTime: {
    type: String
  },
  eventLocation: {
    type: String
  },
  eventOrganizer: {
    type: String
  },
  eventOrganizerPhone: {
    type: Number
  },
  eventOrganizerEmail: {
    type: String
  },
  eventOrganizerWebsite: {
    type: String
  },
  eventOrganizerSocialMedia: {
    type: String
  },
  eventBanner: {
    type: String
  },
  eventLogo: {
    type: String
  },
  eventPhotos: {
    type: Array
  }
})

const Event = mongoose.model('Event', eventSchema)
module.exports = Event
