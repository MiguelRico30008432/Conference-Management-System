//Validates if user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).send({ msg: "User is not authenticated" });
  }
}

function containsOnlyDigits(str) {
  return /^\d+$/.test(str);
}

module.exports = {
  ensureAuthenticated,
  containsOnlyDigits,
};
