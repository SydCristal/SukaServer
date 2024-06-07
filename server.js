const express = require('express')
const app = express()
const cors = require('cors')
const http = require('http')
const PORT = process.env.PORT || 8080
const { authenticate } = require('./controllers/authController')
const { updateConfiguration } = require('./controllers/configurationController')

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
  const { token, userName, password } = socket.handshake.auth
  const data = await authenticate({ userName, password, token })
  const { userId, ownerId, message, ...userData } = data
  const roomId = (ownerId || userId).toString()
  const configurationId = userData.configuration._id
  if (roomId) {
    socket.join(roomId)
    socket.emit('connection', userData)
  } else {
    socket.emit('error', { message })
    socket.disconnect()
  }

  socket.on('updateConfiguration', async configurationUpdate => {
    const configuration = await updateConfiguration(configurationId, configurationUpdate)
    io.to(roomId).emit('updateConfiguration', configuration)
  })

  socket.on('disconnect', () => {
    console.log('DISCONNECT')
    socket.leave(roomId)
    socket.disconnect()
  })
})

server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
  console.log('Press Ctrl+C to quit.')
})

require('./db')