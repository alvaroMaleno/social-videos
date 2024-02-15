const uuid = require('uuid/v4')

function primeRequestContext(req, res, next) {
    req.context = {
        traceId: uuid(),
        userId: req.session ? req.session.userId : null
    }

    next()
}

module.exports = primeRequestContext