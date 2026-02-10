export const handleSuccess = (req, res, statusCode, options) => {
  const args = { ...options };
  const { data, paginator, message, path, errors, pageTitle } = args;
  const jsonResponse = {
    ...(data && { data }),
    ...(paginator && { paginator }),
    ...(message && { message }),
    ...(errors && { validationErrors: errors }),
    ...(pageTitle && { pageTitle }),
  };
  // if (req.accepts("json")) {
  //   return res.status(statusCode).json(jsonResponse);
  // } 
  // const {path, ...remainingRenderOptions} = rest
  return res.render(path, {
    ...jsonResponse
  })

};
