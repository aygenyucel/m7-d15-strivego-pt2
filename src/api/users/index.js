import express from "express";
import createHttpError from "http-errors";
import basicAuthenticationMiddleware from "../lib/auth/basicAuth.js";
import UsersModel from "./model.js";
import AccommodationsModel from "../accommodations/model.js";
import hostOnlyMiddleware from "../lib/auth/hostOnly.js";

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

usersRouter.get(
  "/me",
  basicAuthenticationMiddleware,
  async (req, res, next) => {
    try {
      const user = req.user;
      res.send(user);
    } catch (error) {
      next(error);
    }
  }
);

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

usersRouter.get(
  "/me/accommodations",
  basicAuthenticationMiddleware,
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

usersRouter.post("/register", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/login", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
