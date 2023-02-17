import createHttpError from "http-errors";
import atob from "atob";
import UsersModel from "../../users/model.js";

const basicAuthenticationMiddleware = async (req, res, next) => {
  if (req.headers.authorization) {
    console.log("req.headers.authorization", req.headers.authorization);
    const encodedCredentials = req.headers.authorization.split(" ")[1];
    const credentials = atob(encodedCredentials);
    console.log("credentials:", credentials);

    const [email, password] = credentials.split(":");
    const user = await UsersModel.checkCredentials(email, password);
    if (user) {
      req.user = user;
      next();
    } else {
      next(createHttpError(401, "Credentials are not ok!"));
    }
  } else {
    next(
      createHttpError(
        401,
        "Please provide credentials in the Authorization header!"
      )
    );
  }
};

export default basicAuthenticationMiddleware;
