export const handleSuccess = (req, res, statusCode, options) => {
  const args = { ...options };
  const { data, paginator, message, ...rest } = args;
  const jsonResponse = {
    ...(data && { data }),
    ...(paginator && { paginator }),
    ...(message && { message }),
  };
  if (req.accepts("json")) {
    return res.status(statusCode).json(jsonResponse);
  } else {
    const {path, ...remainingRenderOptions} = rest
    res.render(path, {
        ...jsonResponse,
        ...remainingRenderOptions
    })
  }
};
