const User = require('../models/User')

const updateGuests = async (userId, guests) => {
	try {
		const user = await User.findById(userId)
		if (!user) throw new Error('User not found')
		user.guests = guests
		const updatedUser = await user.save()
		return updatedUser.guests
	} catch ({ message }) {
		return { message }
	}
}

module.exports = { updateGuests }