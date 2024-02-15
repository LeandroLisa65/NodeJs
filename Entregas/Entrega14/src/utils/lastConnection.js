import userModel from '../dao/mongo/models/user.model.js'

const lastConnection = async (userId) => {
    const connection = await userModel.findByIdAndUpdate(userId, { last_connection: new Date() })
}

module.exports = lastConnection