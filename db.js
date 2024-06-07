const mongoose = require('mongoose')

const MONGO_URI = 'mongodb://localhost:27017/SukaRental'

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB')
}).catch((error) => {
		console.log(error);
  console.error('Error connecting to MongoDB:', error)
})