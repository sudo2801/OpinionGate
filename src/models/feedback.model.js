import mongoose, { Schema } from "mongoose";


const feedbackSchema = new Schema(
  {
    customerName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    feedback: {
      type: String,
      required: true,
      trim: true,
    },
    date: { type: Date, default: Date.now },

   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  {
    timestamps: true,
a}
);




export const User = mongoose.model("feedback", feedbackSchema);

