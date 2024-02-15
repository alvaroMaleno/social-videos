const deserializeMessage = require('./deserialize-message')
const messageStoreClient = require('../message-store-api-client')

function project(events, projection) {
  return events.reduce((entity, event) => {
    if (!projection[event.type]) {
      return entity
    }

    return projection[event.type](entity, event)
  }, projection.$init())
}

function createRead({ apiUrl }) {
  function fetch(streamName, projection) {
    return read(apiUrl, streamName).then(messages => project(messages, projection))
  }

  function read(apiUrl, streamName, fromPosition = 0, maxMessages = 1000) {
    let query = null
    let client = messageStoreClient.createMessageStoreApiClient(apiUrl)
    if (streamName === '$all') {
      query = client.getMessages(fromPosition, maxMessages)
    } else
      query = client.getCategoryMessages(streamName, fromPosition, maxMessages)
    return query()
      .then(res => res.rows.map(deserializeMessage))
  }
  function readLastMessage(streamName) {
    return messageStoreClient.createMessageStoreApiClient(apiUrl).getLasMessage(streamName)
      .then(res => deserializeMessage(res.rows[0]))
  }

  return {
    read,
    readLastMessage,
    fetch
  }
}

module.exports = exports = createRead
exports.project = project
