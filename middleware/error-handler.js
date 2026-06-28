const { StatusCodes } = require('http-status-codes');

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later',
  };

  if (process.env.FRONTEND_URL && customError.statusCode === StatusCodes.INTERNAL_SERVER_ERROR) {
    customError.msg = 'Internal Server Error';
  }

  return res.status(customError.statusCode).json({ 
    success: false,
    msg: customError.msg 
  });
};

module.exports = errorHandlerMiddleware;