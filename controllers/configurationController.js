const Configuration = require('../models/Configuration')

const setPreselectedPresets = configuration => {
		const { lightSettings, instalationSettings } = configuration
		if (lightSettings?.enabled && lightSettings?.dynamicPresets?.length && lightSettings?.moodPresets?.length) {
				if (!lightSettings.allSettings.dynamic) lightSettings.allSettings.dynamic = lightSettings.dynamicPresets[0]._id
				if (!lightSettings.allSettings.mood) lightSettings.allSettings.mood = lightSettings.moodPresets[0]._id

				lightSettings.areas.forEach(area => {
						if (!area.dynamic) area.dynamic = lightSettings.dynamicPresets[0]._id
						if (!area.mood) area.mood = lightSettings.moodPresets[0]._id
				})
		}

		if (instalationSettings?.enabled && instalationSettings?.scenePresets?.length && instalationSettings?.soundDesignPresets?.length) {
				instalationSettings.instalations.forEach(instalation => {
						if (!instalation.scene) instalation.scene = instalationSettings.scenePresets[0]._id
						if (!instalation.soundDesign) instalation.soundDesign = instalationSettings.soundDesignPresets[0]._id
				})
		}

		return { ...configuration, lightSettings, instalationSettings }
}

const createConfiguration = async params => {
		try {
				const newConfiguration = new Configuration(params)
				const configuration = await newConfiguration.save().then(c => {
						return setPreselectedPresets(c._doc)
				})

				const result = await Configuration.findOneAndReplace({ _id: configuration._id }, configuration)

				return result
		} catch ({ message }) {
				console.log(message);
				return { message }
		}
}

const editConfiguration = async configurationData => {
		try {
				const { _id, ...params } = setPreselectedPresets(configurationData)
				let configuration = await Configuration.findOneAndReplace({ _id }, { ...params })
				if (!configuration) throw new Error('Configuration not found')
				return configuration
		} catch ({ message }) {
				return { message }
		}
}

const deleteConfiguration = async ownerId => {
		try {
				const configuration = await Configuration.findOneAndDelete({ ownerId })
				if (!configuration) throw new Error('Configuration not found')
				return configuration
		} catch ({ message }) {
				return { message }
		}
}

const updateConfiguration = async (configurationId, newConfiguration) => {
		try {
				const configuration = await Configuration.findById(configurationId)
				if (!configuration) throw new Error('Configuration not found')
				const { active, lightSettings, instalationSettings, preview } = newConfiguration
				if (active !== undefined) configuration.active = active
				if (preview) configuration.preview = { ...preview }
				if (lightSettings) {
						const { areas, allMode, allSettings, timer } = lightSettings
						if (allMode !== undefined) configuration.lightSettings.allMode = allMode
						if (allSettings) configuration.lightSettings.allSettings = {
								...configuration.lightSettings.allSettings,
								...allSettings
						}
						if (timer) configuration.lightSettings.timer = timer
						if (areas) {
								configuration.lightSettings.areas = configuration.lightSettings.areas.map(a => {
										const area = areas.find(area => area._id.toString() === a._id.toString()) || {}
										return { ...a, ...area }
								})
						}
				}

				if (instalationSettings) {
						const { instalations, timer//, allMode, allSettings
						} = instalationSettings
						//if (allMode !== undefined) configuration.instalationSettings.allMode = allMode
						//if (allSettings) configuration.instalationSettings.allSettings = {
						//		...configuration.instalationSettings.allSettings,
						//		...allSettings
						//}
						if (timer) configuration.instalationSettings.timer = timer
						if (instalations) {
								configuration.instalationSettings.instalations = configuration.instalationSettings.instalations.map(i => {
										const instalation = instalations.find(instalation => instalation._id.toString() === i._id.toString()) || {}
										return { ...i, ...instalation }
								})
						}
				}

				const updatedConfiguration = await configuration.save()
				return updatedConfiguration
		} catch ({ message }) {
				return { message }
		}
}

module.exports = { updateConfiguration, createConfiguration, editConfiguration, deleteConfiguration }