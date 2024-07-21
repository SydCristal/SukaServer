const User = require('../models/User')

const createUser = async params => {
		try {
				const newUser = new User(params)
				return await newUser.save()
		} catch ({ message }) {
				return { message }
		}
}

const editUser = async ({ _id, ...params }) => {
		try {
				const user = await User.replaceOne({ _id }, { ...params })
				if (!user) throw new Error('User not found')
				return user
		} catch ({ message }) {
				return { message }
		}
}

const deleteUser = async userId => {
		try {
				const user = await User.findByIdAndDelete(userId)
				if (!user) throw new Error('User not found')
				return user
		} catch ({ message }) {
				return { message }
		}
}

const toggleUser = async ({ _id, active }) => {
		try {
				const user = await User.findByIdAndUpdate(_id, { active })
				if (!user) throw new Error('User not found')
				return user
		} catch ({ message }) {
				return { message }
		}
}

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

module.exports = { updateGuests, createUser, editUser, deleteUser, toggleUser }