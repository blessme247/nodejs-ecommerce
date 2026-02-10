export const handleError = (req, res, statusCode, options) => {
    // const { message, errors = {}, page, data, pageTitle } = options;
    const { errors = {}, message, page, ...rest } = options;
    console.log(errors, 'errors in handleError')
    return res.render(page, {
        ...rest,
        path: page,
        validationErrors: errors,
        errorMessage: message
    })
}
