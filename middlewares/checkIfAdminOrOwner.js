exports.checkIfAdminOrowner = (req, res, next) => {
  if (req.user.role === 1 || req.user.role === 2) {
    next();
  } else {
    res.status(401).json({
      message: "you are not authorized",
    });
  }
};
