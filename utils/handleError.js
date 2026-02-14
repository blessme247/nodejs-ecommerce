export const handleError = (req, res, statusCode, options) => {
    // const { message, errors = {}, page, data, pageTitle } = options;
    const { errors = [], message, filePath, pageTitle = 'EvoMart - Your Online Store', ...rest } = options;
    // console.log(errors, 'errors in handleError')
    return res.render(filePath, {
        ...rest,
        pathName: filePath,
        validationErrors: errors,
        errorMessage: message,
        pageTitle: pageTitle
    })
}
