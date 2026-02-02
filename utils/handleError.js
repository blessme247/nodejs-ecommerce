export const handleError = (req, res, statusCode, message) => {
    if(req.accepts("json")){
        return res.status(statusCode).json({message})
    }
    return res.render(req.path, {
        message,
        path: req.path
    })
}