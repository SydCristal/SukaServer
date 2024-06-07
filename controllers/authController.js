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
				if (token) {
						const { userId } = decryptToken(token)
						credentials = { _id: userId }
				}

				const query = User.where(credentials)
				const user = await query.findOne().then(async ({ _id, ownerId, active }) => {
						const configuration = await Configuration.findOne({ ownerId: ownerId || _id })
						const result = { configuration, active, _id, ownerId }
						if (!ownerId) {
								const guests = await User.find({ ownerId: _id })
								result.guests = guests
						}

						return result
				}).catch(e => {
						throw new Error('User not found')
				})

				const { active, _id, ownerId, ...userData } = user
				if (active === false) {
						throw new Error('User is inactive')
				}

				if (!token) {
						const message = createMessage({ userId: _id, configurationId: userData.configuration._id, ownerId })
						token = `${message}.${createSignature(message)}`
				}

				return {
						token,
						userId: _id,
						ownerId,
						...userData
				}
		} catch ({ message }) {
				return { message }
		}
}

module.exports = { authenticate, decryptToken }