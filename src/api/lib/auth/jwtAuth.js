import createHttpError from "http-errors";
import { verifyAccessToken } from "./tools.js";

const JWTAuthMiddleware = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const accessToken = req.headers.authorization.replace("Bearer ", "");

      const payload = await verifyAccessToken(accessToken);

      req.user = {
        _id: payload._id,
        role: payload.role,
      };
      next();
    } else {
      next(
        createHttpError(
          401,
          "Please provide Bearer Token in the authorization header!"
        )
      );
    }
  } catch (error) {
    next(createHttpError(401, "Token not valid!"));
  }
};

export default JWTAuthMiddleware;
