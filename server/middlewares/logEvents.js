const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const { v4: uuid } = require('uuid');
const { format } = require('date-fns');

const logEvents = async (message, filename) => {
    const dataTime = format(new Date(), 'yyyy-MM-dd\tHH:mm:ss');
    const logItem = `${dataTime}\t${uuid()}\t${message}\n`;
    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', filename), logItem);
    } catch (error) {
        console.log(error);
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'requests.log');
    next();
}

module.exports = {
    logEvents,
    logger
};