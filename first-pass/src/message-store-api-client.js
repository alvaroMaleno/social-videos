const FormData = require('form-data')
const fetch = require('node-fetch-commonjs')

function createMessageStoreApiClient(apiUrl) {

    const baseUrl = apiUrl;
    function getMessages(globalPosition, limit) {
        url = `/getMessages?global_position=${globalPosition}&max_messages=${limit}`
        fetch(baseUrl.concat(url)).then(res => { return res.json() })
    }

    function getLastMessage(streamName) {
        url = `/getLastMessage?stream_name=${streamName}`
        fetch(baseUrl.concat(url)).then(res => { return res.json() })
    }

    function getCategoryMessages(streamName, fromPosition, maxMessages) {
        url =
            `/getCategoryMessages?stream_name=${streamName}&from_position=${fromPosition}&max_messages=${maxMessages}`
        fetch(baseUrl.concat(url)).then(res => { return res.json() })
    }

    function postCategoryMessage({ messageId, streamName, type, data, metaData }) {
        let form = new FormData()
        form.append('message_id', messageId)
        form.append('stream_name', streamName)
        form.append('type', type)
        form.append('data', JSON.stringify(data ?? ''))
        form.append('meta_data', JSON.stringify(metaData ?? ''))
        url =
            '/postMessage'
        var res =
            fetch(
                baseUrl.concat(url),
                { method: 'POST', body: form }
            ).then(res => res.text())
        return res
    }

    return {
        getMessages,
        getLastMessage,
        getCategoryMessages,
        postCategoryMessage
    }

}


module.exports = createMessageStoreApiClient