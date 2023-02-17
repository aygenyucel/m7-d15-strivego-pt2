import createHttpError from "http-errors";
import UsersModel from "../../users/model.js";

const hostOnlyMiddleware = async (req, res, next) => {
  const role = req.user.role;
  if (role === "host") {
    next();
  } else {
    next(createHttpError(403, "Only hosts can access this endpoint!"));
  }
};

export default hostOnlyMiddleware;
