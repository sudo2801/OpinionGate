import { Feedback } from "../models/feedback.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { APiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createFeedback = asyncHandler(async (req, res) => {
  const { customerName, feedback, userId } = req.body;

  if ([customerName, feedback, userId].some((field) => field.trim() === "")) {
    throw new ApiError(400, "customerName and feedback  required");
  }

  const newFB = await Feedback.create({
    customerName,
    feedback,
    userId: userId,
  });

  if (!newFB) {
    throw new ApiError(500, "Something went wrong 🔴");
  }

  return res
    .status(201)
    .json(new APiResponse(200, newFB, "Feedback submitted successfully"));
});

const getFeedback = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    throw new ApiError(400, "userID is required");
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    let allFeedback;

    if (user.role === "admin") {
      allFeedback = await Feedback.find();
    } else {
      allFeedback = await Feedback.find({ userId: userId });
    }

    if (!allFeedback) {
      throw new ApiError(404, "Feedback not found");
    }

    return res.status(200).json(new APiResponse(200, allFeedback));
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Something went wrong");
  }
});

const deleteFeedback = asyncHandler(async (req, res) => {
  const { feedbackId, userId } = req.body || {};

  if ([feedbackId, userId].some((field) => field.trim() === "")) {
    throw new ApiError(400, "customerName and userId  required");
  }

  try {
    const user = User.findOne({ _id: userId });

    if (!user) {
      throw new ApiError(500, "Something went wrong 🔴");
    }

    let deleteFeedback;

    if (user.role === "admin") {
      deleteFeedback = await Feedback.deleteOne({ _id: feedbackId });
    } else {
      deleteFeedback = await Feedback.deleteOne({
        _id: feedbackId,
        _id: userId,
      });
    }

    if (!deleteFeedback) {
      throw new ApiError(500, "Something went wrong 🔴");
    }

    return res
      .status(202)
      .json(
        new APiResponse(202, deleteFeedback, "Feedback deleted successfully")
      );
  } catch (error) {
    throw new ApiError(500, "Something went wrong");
  }
});

export { createFeedback, getFeedback, deleteFeedback };
