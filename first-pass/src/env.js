const colors = require('colors/safe')
const dotenv = require('dotenv')

const packageJson = require('../package.json')

const envResult = dotenv.config()

if (envResult.error) {
  // eslint-disable-next-line no-console
  console.error(
    `${colors.red('[ERROR] env failed to load:')} ${envResult.error}`
  )

  process.exit(1)
}

function requireFromEnv(key) {
  if (!process.env[key]) {
    // eslint-disable-next-line no-console
    console.error(`${colors.red('[APP ERROR] Missing env variable:')} ${key}`)

    return process.exit(1)
  }

  return process.env[key]
}


module.exports = {
  appName: requireFromEnv('APP_NAME'),
  env: requireFromEnv('NODE_ENV'),
  port: parseInt(requireFromEnv('PORT'), 10),
  dbHost: requireFromEnv('DB_HOST'),
  dbPort: parseInt(requireFromEnv('DB_PORT'), 10),
  dbUser: requireFromEnv('DB_USER'),
  dbPass: requireFromEnv('DB_PASS'),
  db: requireFromEnv('DB'),
  dbClient: requireFromEnv('DB_CLIENT'),
  version: packageJson.version,
  mssgStoreApiUrl: requireFromEnv('MESSAGE_STORE_API'),
}