const express = require('express')
const app = express()
const cors = require('cors')
const http = require('http')
const PORT = process.env.PORT || 8080
const { authenticate } = require('./controllers/authController')
const { updateConfiguration, createConfiguration, editConfiguration } = require('./controllers/configurationController')
const { updateGuests, createUser } = require('./controllers/userController')
const Configuration = require('./models/Configuration')

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors({ origin: ['http://localhost:3000'] }))

const server = http.createServer(app)

const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

//app.get('/', (req, res) => {
//  res.status(200).send('Solidarity Forever!')
//})

io.on('connection', async socket => {
  const { token, userName, password, newUser, isHardware = false } = socket.handshake.auth
  const data = await authenticate({ userName, password, token, newUser })
  try {
    if (data.message) throw new Error(data.message)
    const { userId, message, ...userData } = data
    const roomId = userId.toString()
    const configurationId = userData.configuration?._id
    if (roomId) {
      socket.join(roomId)
      if (isHardware) socket.join(roomId + '-hardware')
      socket.emit('connection', userData)
    } else {
      socket.emit('error', { message })
      socket.disconnect()
    }

    socket.on('updateGuests', async guests => {
      const updatedGuests = await updateGuests(userId, guests)
      io.to(roomId).emit('updateGuests', updatedGuests)
    })

    socket.on('requestConfiguration', async ({ ownerId }) => {
      const configuration = await Configuration.findOne({ ownerId })
      socket.emit('requestConfiguration', configuration)
    })

    socket.on('previewConfiguration', previewConfiguration => {
      io.to(roomId + '-hardware').emit('updateConfiguration', previewConfiguration)
    })

    socket.on('updateConfiguration', async configurationUpdate => {
      const configuration = await updateConfiguration(configurationId, configurationUpdate)
      io.to(roomId).emit('updateConfiguration', configuration)
    })

    socket.on('editConfiguration', async configurationData => {
      const configuration = await editConfiguration(configurationData)
      io.to(roomId).emit('editConfiguration', configuration)
    })

    socket.on('createConfiguration', async configurationData => {
      const configuration = await createConfiguration({ ...configurationData, ownerId: userId })
      io.to(roomId + '-hardware').emit('createConfiguration', configuration)
    })

    socket.on('createUser', async userData => {
      const user = await createUser(userData)
      io.to(roomId).emit('createUser', user)
    })

    socket.on('disconnect', () => {
      console.log('DISCONNECT')
      socket.leave(roomId)
      if (isHardware) socket.leave(roomId + '-hardware')
      socket.disconnect()
    })
  } catch ({ message }) {
    console.error(message)
    socket.emit('error', { message })
    socket.disconnect()
  }
})

server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
  console.log('Press Ctrl+C to quit.')
})

require('./db')