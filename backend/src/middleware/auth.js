import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  const authorization = req.headers.authorization || "";
  const token = authorization.startsWith("Bearer ")
    ? authorization.slice(7)
    : null;

  if (!token) {
    res.status(401);
    throw new Error("Authentication required");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    res.status(401);
    throw new Error("Invalid or expired authentication token");
  }

  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) {
    res.status(401);
    throw new Error("User account is unavailable");
  }

  req.user = user;
  next();
});

export const developerOnly = (req, res, next) => {
  if (req.user?.role !== "developer") {
    res.status(403);
    return next(new Error("Developer access required"));
  }
  next();
};
