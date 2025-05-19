const ReturnResponseUtil = require("../utils/returnResponse");

function authorize(allowedRoles) {
  return (req, res, next) => {
    const user = req.user;
    // console.log(allowedRoles)
    // console.log(user.role);
    if (!allowedRoles.includes(user.role)) {
      ReturnResponseUtil.returnResponse(
        res,
        403,
        false,
        `You don't have permission to perform this action. Your role '${user.role}' is not allowed.`
      );
    } else {
      next();
    }
  };
}

module.exports = { authorize };
