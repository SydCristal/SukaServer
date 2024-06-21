const mongoose = require('mongoose')

const MONGO_URI = 'mongodb+srv://doadmin:07g4P368t5Kc2yeJ@dbaas-db-4665123-efcdf301.mongo.ondigitalocean.com/SukaDB?tls=true&authSource=admin&replicaSet=dbaas-db-4665123'

mongoose.connect(MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
}).then(() => {
	console.log('Connected to MongoDB')
}).catch((error) => {
	console.log(error);
	console.error('Error connecting to MongoDB:', error)
})