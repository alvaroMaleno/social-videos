const createKnexClient = require('./knex-client')
const createHomeApp = require('./app/home')
const createRecordViewingsApp = require('./app/record-viewings')
const createMessageStore = require('./message-store')


function createConfig({ env }) {
    const knexClient = createKnexClient({
        dbclient: env.dbClient,
        connection: {
            host: env.dbHost,
            port: env.dbPort,
            user: env.dbUser,
            dbPass: env.dbPass,
            db: env.db
        }
    })

    const messageStore = createMessageStore({ apiUrl: env.mssgStoreApiUrl })
    const homeApp = createHomeApp({ db: knexClient })
    const recordViewingsApp = createRecordViewingsApp({ messageStore })

    return {
        env,
        homeApp,
        recordViewingsApp,
        messageStore
    }
}

module.exports = createConfig