export const handleSuccess = (req, res, statusCode, options) => {
  const args = { ...options };
  const { data, paginator = undefined, message = '', filePath, pageTitle = 'EvoMart - Your Online Store', ...rest } = args;
  
  const jsonResponse = {
    // ...(data && { data }),
    ...(paginator && { paginator }),
    ...(message && { message }),
    ...(pageTitle && { pageTitle }),
  };
  // if (req.accepts("json")) {
  //   return res.status(statusCode).json(jsonResponse);
  // } 
  // const {path, ...remainingRenderOptions} = rest
  return res.render(filePath, {
    ...jsonResponse,
    ...rest,
    data
  })

};
