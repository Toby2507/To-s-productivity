const { logEvents } = require('./logEvents');

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}`, 'errors.log');
    res.status(500).json(err.message);
}

module.exports = errorHandler;