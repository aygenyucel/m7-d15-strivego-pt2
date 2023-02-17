import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const accommodationSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    maxGuest: { type: Number, required: true },
    city: { type: String, required: true },
    host: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default model("Accommodation", accommodationSchema);
