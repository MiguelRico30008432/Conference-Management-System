//Validates if user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // User is authenticated, proceed to the next middleware/route handler
  } else {
    // User is not authenticated, respond with a 401 Unauthorized status code
    return res.status(401).send({ msg: "User is not authenticated" });
  }
}

module.exports = {
  ensureAuthenticated,
};
