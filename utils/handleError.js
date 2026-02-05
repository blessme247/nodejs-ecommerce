export const handleError = (req, res, statusCode, options) => {
    const { message, errors } = options;
    if(req.accepts("json")){
        return res.status(statusCode).json({message})
    }
    const jsonResponse = {
        ...(message && { message }),
        ...(errors && { errors })
    }
    return res.render(req.path, {
        ...jsonResponse,
        path: req.path
    })
}