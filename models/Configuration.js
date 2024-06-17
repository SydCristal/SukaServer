const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const moodSchema = new mongoose.Schema({
	name: { type: String, required: true },
})

const dynamicSchema = new mongoose.Schema({
	name: { type: String, required: true },
})

const sceneSchema = new mongoose.Schema({
	name: { type: String, required: true },
})

const soundDesignSchema = new mongoose.Schema({
	name: { type: String, required: true },
})

const areaSchema = new mongoose.Schema({
	name: { type: String, required: true },
	active: { type: Boolean, default: true },
	mood: ObjectId,
	brightness: { type: Number, default: 50, min: 0, max: 100 },
	dynamic: ObjectId,
	audioReactive: { type: Boolean, default: true },
	speed: { type: Number, default: 50, min: 0, max: 100 },
})

const instalationSchema = new mongoose.Schema({
	name: { type: String, required: true },
	active: { type: Boolean, default: true },
	scene: ObjectId,
	interactive: { type: Boolean, default: true },
	intensity: { type: Number, default: 50, min: 0, max: 100 },
	soundDesign: ObjectId,
	volume: { type: Number, default: 50, min: 0, max: 100 },
})

const lightSettingsSchema = new mongoose.Schema({
	areas: {
		type: [areaSchema],
		required: true
	},
	moodPresets: {
		type: [moodSchema],
		required: true
	},
	dynamicPresets: {
		type: [dynamicSchema],
		required: true
	},
	allMode: {
		type: Boolean,
		default: false
	},
	allSettings: {
		type: areaSchema,
		default: () => ({ name: 'all' })
	}
})

const instalationSettingsSchema = new mongoose.Schema({
	instalations: {
		type: [instalationSchema],
		required: true
	},
	soundDesignPresets: {
		type: [soundDesignSchema],
		required: true
	},
	scenePresets: {
		type: [sceneSchema],
		required: true
	},
	allMode: {
		type: Boolean,
		default: false
	},
	allSettings: {
		type: instalationSchema,
		default: () => ({ name: 'all' })
	},
})

const configurationSchema = new mongoose.Schema({
	active: { type: Boolean, default: true },
	ownerId: ObjectId,
	lightSettings: lightSettingsSchema,
	instalationSettings: instalationSettingsSchema
})

module.exports = mongoose.model('Configuration', configurationSchema)