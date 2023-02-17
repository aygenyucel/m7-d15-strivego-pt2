import express from "express";
import createHttpError from "http-errors";
import basicAuthenticationMiddleware from "../lib/auth/basicAuth.js";
import UsersModel from "./model.js";
import AccommodationsModel from "../accommodations/model.js";
import hostOnlyMiddleware from "../lib/auth/hostOnly.js";
import { createAccessToken } from "../lib/auth/tools.js";
import JWTAuthMiddleware from "../lib/auth/jwtAuth.js";

const usersRouter = express.Router();

usersRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new UsersModel(req.body);
    const { _id } = await newUser.save();

    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});
usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await UsersModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

// usersRouter.get(
//   "/me",
//   basicAuthenticationMiddleware,
//   async (req, res, next) => {
//     try {
//       const user = req.user;
//       res.send(user);
//     } catch (error) {
//       next(error);
//     }
//   }
// );
// will return your user information without the password
usersRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    //req.user come from JWTAuthMiddleware
    const userId = req.user._id;
    const user = await UsersModel.findById(userId);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/:userId", async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.params.userId);

    if (user) {
      res.send(user);
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});
usersRouter.put("/:userId", async (req, res, next) => {
  try {
    const user = await UsersModel.findByIdAndUpdate(
      req.params.userId,
      {
        ...req.body,
      },
      { new: true, runValidators: true }
    );
    if (user) {
      res.send(user);
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});
usersRouter.delete("/:userId", async (req, res, next) => {
  try {
    const deletedUser = await UsersModel.findByIdAndDelete(req.params.userId);
    if (deletedUser) {
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

// returns the full list of managed accommodations

usersRouter.get(
  "/me/accommodations",
  JWTAuthMiddleware,
  hostOnlyMiddleware,
  async (req, res, next) => {
    try {
      const userId = req.user._id;
      const accommodations = await AccommodationsModel.find({ host: userId });
      res.send(accommodations);
    } catch (error) {
      next(error);
    }
  }
);

// expects email, password and role
// creates a new user
// returns a JWT token already valid
usersRouter.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const isUser = await UsersModel.checkCredentials(email, password);
    if (isUser) {
      next(createHttpError(403, "User with this email already exist!"));
    } else {
      const newUser = new UsersModel({ email, password });
      await newUser.save();
      const payload = { _id: newUser._id, role: newUser.role };

      const accessToken = await createAccessToken(payload);
      res.status(201).send({ accessToken });
    }
  } catch (error) {
    next(error);
  }
});

// returns a JWT token
usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UsersModel.checkCredentials(email, password);

    if (user) {
      const payload = { _id: user._id, role: user.role };

      const accessToken = await createAccessToken(payload);
      res.send({ accessToken });
    } else {
      next(createHttpError(401, "Credentials are not ok!"));
    }
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
