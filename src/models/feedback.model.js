import mongoose, { Schema } from "mongoose";

const feedbackSchema = new Schema(
  {
    customerName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    feedback: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Feedback = mongoose.model("feedback", feedbackSchema);
