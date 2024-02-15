const VersionConflictError = require('./version-conflict-error')
const versionConflictErrorRegex = /^Wrong.*Stream Version: (\d+)\)/
const createMessageStoreApiClient = require('../message-store-api-client')

function createWrite({ apiUrl }) {
    return (streamName, message, expectedVersion) => {
        if (!message.type) {
            throw new Error('Messages must have a type')
        }
        let client = createMessageStoreApiClient(apiUrl)
        // const values = [
        //     message.id,
        //     streamName,
        //     message.type,
        //     message.data,
        //     message.metadata,
        //     expectedVersion
        // ]

        return client.postCategoryMessage({
            "messageId": message.id,
            "streamName": streamName,
            "type": message.type,
            "data": message.data,
            "metaData": message.metaData
        }).then(res => { return res })
            .catch(err => {
                const errorMatch = err.message.match(versionConflictErrorRegex) // (6)
                const notVersionConflict = errorMatch === null

                if (notVersionConflict) {
                    throw err
                }

                const actualVersion = parseInt(errorMatch[1], 10)

                const versionConflictError = new VersionConflictError(
                    streamName,
                    actualVersion,
                    expectedVersion
                )
                versionConflictError.stack = err.stack

                throw versionConflictError
            })
    }
}

module.exports = createWrite