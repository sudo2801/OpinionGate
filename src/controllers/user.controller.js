import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { APiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token "
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, userName, password, role } = req.body;

  if (
    [fullName, userName, password, role].some((field) => field.trim() === "")
  ) {
    throw new ApiError(400, "fullName is required");
  }
  const existedUser = await User.findOne({
    $or: [{ userName }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with username already exist 🔴");
  }


  const user = await User.create({
    userName,
    fullName,
    password,
    role,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating user 🔴");
  }

  return res
    .status(201)
    .json(new APiResponse(200, createdUser, "User Created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const {  userName, password } = req.body;
  if (!(userName && password)) {
    throw new ApiError(400, "Username or password is required");
  }

  const user = await User.findOne({
    $or: [{ userName }],
  });

  if (!user) {
    throw new ApiError(404, "User is not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credential 🟠");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new APiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "Logged In SuccessFull 💥"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new APiResponse(200, {}, "User logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request.");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired or used");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new APiResponse(
          200,
          {
            accessToken,
            newRefreshToken,
          },
          "Access Token refreshed successful"
        )
      );
  } catch (error) { 
    throw new ApiError(401,"invalid refreshToken")
  }
});

export { registerUser, loginUser, logoutUser, refreshAccessToken };


