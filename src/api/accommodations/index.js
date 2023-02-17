import express from "express";
import createHttpError from "http-errors";
import AccommodationsModel from "./model.js";
import basicAuthenticationMiddleware from "./../lib/auth/basicAuth.js";
import hostOnlyMiddleware from "../lib/auth/hostOnly.js";

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
accommodationsRouter.get(
  "/",
  basicAuthenticationMiddleware,
  async (req, res, next) => {
    try {
      const accommodations = await AccommodationsModel.find({});
      res.send(accommodations);
    } catch (error) {
      next(error);
    }
  }
);
accommodationsRouter.get(
  "/:accommodationId",
  basicAuthenticationMiddleware,
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
accommodationsRouter.put("/:accommodationId", async (req, res, next) => {
  try {
    const updatedAccommodation = await AccommodationsModel.findByIdAndUpdate(
      req.params.accommodationId,
      {
        ...req.body,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (updatedAccommodation) {
      res.send(updatedAccommodation);
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
});
accommodationsRouter.delete("/:accommodationId", async (req, res, next) => {
  try {
    const deletedAccommodation = await AccommodationsModel.findByIdAndDelete(
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
  } catch (error) {
    next(error);
  }
});

export default accommodationsRouter;
