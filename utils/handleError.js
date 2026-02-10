export const handleError = (req, res, statusCode, options) => {
    // const { message, errors = {}, page, data, pageTitle } = options;
    const { errors = {}, message, page, ...rest } = options;
    console.log(rest, 'rest options')
    return res.render(page, {
        ...rest,
        path: page,
        validationErrors: errors,
        errorMessage: message
    })
}
