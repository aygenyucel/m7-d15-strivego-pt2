import express from "express";
import createHttpError from "http-errors";
import AccommodationsModel from "./model.js";
import basicAuthenticationMiddleware from "./../lib/auth/basicAuth.js";
import hostOnlyMiddleware from "../lib/auth/hostOnly.js";
import JWTAuthMiddleware from "../lib/auth/jwtAuth.js";

const accommodationsRouter = express.Router();

accommodationsRouter.post(
  "/",
  basicAuthenticationMiddleware,
  hostOnlyMiddleware,
  async (req, res, next) => {
    try {
      const newAccommodation = new AccommodationsModel(req.body);
      const { _id } = await newAccommodation.save();
      res.status(201).send();
    } catch (error) {
      next(error);
    }
  }
);
accommodationsRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const accommodations = await AccommodationsModel.find({});
    res.send(accommodations);
  } catch (error) {
    next(error);
  }
});
accommodationsRouter.get(
  "/:accommodationId",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const accomodation = await AccommodationsModel.findById(
        req.params.accommodationId
      );
      if (accomodation) {
        res.send(accomodation);
      } else {
        next(
          createHttpError(
            404,
            `Accomodation with id ${req.params.accommodationId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);
accommodationsRouter.put(
  "/:accommodationId",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const userId = req.user._id;

      const accommodation = await AccommodationsModel.findById(
        req.params.accommodationId
      );

      if (accommodation) {
        if (accommodation.host.toString() === userId) {
          const updatedAccommodation =
            await AccommodationsModel.findByIdAndUpdate(
              req.params.accommodationId,
              {
                ...req.body,
              },
              {
                new: true,
                runValidators: true,
              }
            );
          res.send(updatedAccommodation);
        } else {
          next(
            createHttpError(
              403,
              "Only accommodation host can access this endpoint!"
            )
          );
        }
      } else {
        next(
          createHttpError(
            404,
            `Accomodation with id ${req.params.accommodationId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);
accommodationsRouter.delete(
  "/:accommodationId",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const userId = req.user._id;

      const accommodation = await AccommodationsModel.findById(
        req.params.accommodationId
      );
      if (accommodation.host.toString() === userId) {
        const deletedAccommodation =
          await AccommodationsModel.findByIdAndDelete(
            req.params.accommodationId
          );

        if (deletedAccommodation) {
          res.status(204).send();
        } else {
          next(
            createHttpError(
              404,
              `Accomodation with id ${req.params.accommodationId} not found!`
            )
          );
        }
      } else {
        next(createHttpError(403, "Only host of this acommodation can delete"));
      }
    } catch (error) {
      next(error);
    }
  }
);

export default accommodationsRouter;
