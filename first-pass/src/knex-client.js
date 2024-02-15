const Bluebird = require('bluebird')
const knex = require('knex')

function createKnexClient({ dbclient, connection, migrationsTableName }) {
    const client = knex({
        client: dbclient,
        connection: {
            host: connection.host,
            port: connection.port,
            user: connection.user,
            password: connection.dbPass,
            database: connection.db
        },
        searchPath: ['knex', 'public'],
    })

    const migrationOptions = {
        tableName: migrationsTableName || 'knex_migrations'
    }

    return Bluebird.resolve(client.migrate.latest(migrationOptions))
        .then(() => client)
}

module.exports = createKnexClient