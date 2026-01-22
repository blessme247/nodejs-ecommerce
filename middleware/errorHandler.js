import logEvents from "./logEvents.js"

const errorHandler = (err, req, res, next)=> {
    logEvents.logEvent(`${err.name}: ${err.message}`, 'errorLog.txt')
    console.error(err.stack)
    res.status(500).send(err.message)
}

export default errorHandler