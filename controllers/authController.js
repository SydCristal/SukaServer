const SHA256 = require('crypto-js/sha256')
const User = require('../models/User')
const Configuration = require('../models/Configuration')

const createMessage = params => {
		const header = btoa(JSON.stringify({ alg: 'SHA256', typ: 'JWT' }))
		const payload = btoa(JSON.stringify(params))
		return `${header}.${payload}`
}

const createSignature = message => {
		return SHA256(message, 'HOBOROBOT666').toString()
}

const decryptToken = token => {
		const [header, payload, signature] = token.split('.')
		if (createSignature(`${header}.${payload}`) !== signature) {
				throw new Error('Token is invalid')
		}

		return JSON.parse(atob(payload))
}

const authenticate = async ({ token, ...credentials }) => {
		try {
				let userRole = 'owner'
				if (token) {
						const { userId, role } = decryptToken(token)
						userRole = role
						credentials = { _id: userId }
				} else if (credentials.newUser) {
						const newUser = await User.create(credentials.newUser)
						await Configuration.create({ ownerId: newUser._id, ...defaultConfiguration })
						credentials = { userName: credentials.newUser.userName, password: credentials.newUser.password }
				}

				const query = User.where(credentials)
				const user = await query.findOne().then(async userData => {
						if (!userData) {
								const ownerData = await User.findOne({ userName: credentials.userName })
								if (!ownerData) {
										throw new Error('USER_NOT_FOUND')
								} else if (ownerData.guests.some(({ password }) => password === credentials.password)) {
										userData = ownerData.guests.find(({ password }) => password === credentials.password)
										userData._id = ownerData._id
										userRole = 'guest'
										if (userData.active === false) throw new Error('GUEST_IS_INACTIVE')
								} else {
										throw new Error('PASSWORD_IS_INCORRECT')
								}
						}

						const { _id, active, password, isAdmin = false } = userData

						let result = { active, _id, ownerId: _id }

						if (isAdmin) {
								const users = await User.find({ isAdmin: { $ne: true } })
								result = {
										...result,
										users,
										role: 'admin',
										password
								}
						} else {
								let configuration = await Configuration.findOne({ ownerId: _id })

								result = {
										...result,
										configuration,
										role: userRole
								}
								
								if (userRole === 'owner') {
										result.guests = userData.guests
										result.password = password
								}
						}

						return result
				}).catch(({ message }) => {
						console.error(message)
						throw new Error(message)
				})

				const { active, _id, ...userData } = user
				if (active === false) {
						throw new Error('USER_IS_INACTIVE')
				}

				if (!token) {
						const message = createMessage({ userId: _id, configurationId: userData.configuration?._id || null, role: userRole })
						token = `${message}.${createSignature(message)}`
				}

				return {
						token,
						userId: _id,
						...userData
				}
		} catch ({ message }) {
				return { message }
		}
}

module.exports = { authenticate, decryptToken }