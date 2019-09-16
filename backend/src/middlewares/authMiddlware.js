export default (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.status(403).send({
      message: 'User is not authenticated!',
    });
  } else {
    next();
  }
};
