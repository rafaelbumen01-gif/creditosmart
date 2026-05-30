function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${err.message}`, err.stack);
  const status = err.statusCode || 500;
  res.status(status).json({
    error: err.message || "Error interno del servidor",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

module.exports = errorHandler;
