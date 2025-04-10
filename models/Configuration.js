const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const moodSchema = new mongoose.Schema({
		name: { type: String, required: true },
		icon: { type: String }
})

const dynamicSchema = new mongoose.Schema({
		name: { type: String, required: true },
		icon: { type: String }
})

const sceneSchema = new mongoose.Schema({
		name: { type: String, required: true },
		icon: { type: String }
})

const soundDesignSchema = new mongoose.Schema({
		name: { type: String, required: true },
		icon: { type: String }
})

const timerSchema = new mongoose.Schema({
		active: { type: Boolean, default: false },
		wakeTime: { type: Array, default: [18, 0] },
		snoozeTime: { type: Array, default: [0, 0] },
		snooze:	{ type: Boolean, default: false }
})

const areaSchema = new mongoose.Schema({
		name: { type: String, required: true },
		active: { type: Boolean, default: true },
		mood: ObjectId,
		brightness: { type: Number, default: 50, min: 0, max: 100 },
		dynamic: ObjectId,
		audioReactive: { type: Boolean, default: true },
		speed: { type: Number, default: 50, min: 0, max: 100 },
		timer: {
				type: timerSchema,
				default: () => ({ active: false })
		}
})

const instalationSchema = new mongoose.Schema({
		name: { type: String, required: true },
		active: { type: Boolean, default: true },
		scene: ObjectId,
		interactive: { type: Boolean, default: true },
		intensity: { type: Number, default: 50, min: 0, max: 100 },
		brightness: { type: Number, default: 50, min: 0, max: 100 },
		speed: { type: Number, default: 50, min: 0, max: 100 },
		soundDesign: ObjectId,
		volume: { type: Number, default: 50, min: 0, max: 100 },
		timer: {
				type: timerSchema,
				default: () => ({ active: false })
		}
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
		},
		enabled: {
				type: Boolean,
				default: true
		},
		timer: {
				type: timerSchema,
				default: () => ({ active: false })
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
		enabled: {
				type: Boolean,
				default: true
		},
		timer: {
				type: timerSchema,
				default: () => ({ active: false })
		}
		//allMode: {
		//	type: Boolean,
		//	default: false
		//},
		//allSettings: {
		//	type: instalationSchema,
		//	default: () => ({ name: 'all' })
		//},
})

const previewSchema = new mongoose.Schema({
		active: { type: Boolean, default: false },
		duration: { type: Number, default: 60 },
		enabled: { type: Boolean, default: true }
})

const configurationSchema = new mongoose.Schema({
		active: { type: Boolean, default: true },
		ownerId: { type: ObjectId, required: true },
		preview: previewSchema,
		lightSettings: lightSettingsSchema,
		instalationSettings: instalationSettingsSchema
})

module.exports = mongoose.model('Configuration', configurationSchema)