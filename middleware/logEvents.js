import { v4 } from "uuid";
import { format } from "date-fns";
import fs from "fs"
import path from "path"
const {dirname} = import.meta

 const logEvent = (message, fileName)=> {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
    const logItem = `${dateTime}\t${v4()}\t${message}\n`
    console.log(logItem)
    if(!fs.existsSync(path.join(dirname, '..', 'logs'))){
        fs.mkdir(path.join(dirname, '..', 'logs'), (err)=> {
            if(err){
                console.log("error making direcory", err)
            }
        })
    }
    fs.appendFile(path.join(dirname, '..', 'logs', fileName), logItem, (err)=>{
        if(err){
            console.log({err})
        }
    })
}

const logger = (req, res, next)=> {
    const message = `${req.method}\t${req.url}\t${req.headers.origin}`
    logEvent(message, "requestLogs.txt")
    next()
}

export default {logger, logEvent}