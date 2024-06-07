const Configuration = require('../models/Configuration')

const updateConfiguration = async (configurationId, newConfiguration) => {
		try {
				let result = {}
				const configuration = await Configuration.findById(configurationId)
				if (!configuration) throw new Error('Configuration not found')
				const { active, lightSettings, instalationSettings } = newConfiguration
				if (active !== undefined) configuration.active = active
				if (lightSettings) {
						const { area, allMode, allSettings } = lightSettings
						if (allMode !== undefined) configuration.lightSettings.allMode = allMode
						if (allSettings) configuration.lightSettings.allSettings = {
								...configuration.lightSettings.allSettings,
								...allSettings
						}
						if (area) {
								configuration.lightSettings.areas = configuration.lightSettings.areas.map(a => {
										if (a._id.toString() === area._id) {
												a = { ...a, ...area }
										}

										return a
								})
						}
				}

				if (instalationSettings) {
						const { instalation, allMode, allSettings } = instalationSettings
						if (allMode !== undefined) configuration.instalationSettings.allMode = allMode
						if (allSettings) configuration.instalationSettings.allSettings = {
								...configuration.instalationSettings.allSettings,
								...allSettings
						}
						if (instalation) {
								configuration.instalationSettings.instalations = configuration.instalationSettings.instalations.map(i => {
										if (i._id.toString() === instalation._id) {
												i = { ...i, ...instalation }
										}

										return i
								})
						}
				}

				const updatedConfiguration = await configuration.save()
				return updatedConfiguration
		} catch ({ message }) {
				return { message }
		}
}

module.exports = { updateConfiguration }