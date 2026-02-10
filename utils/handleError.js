export const handleError = (req, res, statusCode, options) => {
    const { message, errors = {}, page, data, pageTitle } = options;
    // if(req.accepts("json")){
    //     console.log("fail here")
    //     return res.status(statusCode).json({message})
    // }
    const jsonResponse = {
        ...(message && { errorMessage: message }),
        // ...(Object.keys(errors).length > 0 && { validationErrors: errors }),
        ...(data && { data }),
        ...(pageTitle && { pageTitle }),
        validationErrors: errors
    }
    // console.log(jsonResponse, 'jsonResponse in handleError') 
    return res.render(page, {
        ...jsonResponse,
        path: page,
    })
}