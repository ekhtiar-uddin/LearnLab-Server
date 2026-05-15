// controllers/userProgress.controller. ts

import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserProgressService } from "./userProgress.service";

const createUserProgress = catchAsync(async (req: Request, res: Response) => {
  const result = await UserProgressService.createUserProgress(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User Progress has been created successfully",
    data: result,
  });
});

const getUserProgressByCourse = catchAsync(async (req, res) => {
  const { userId, courseId } = req.query;

  const result = await UserProgressService.getUserProgressByCourse(
    userId as string,
    courseId as string
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User Progress retrieved successfully",
    data: result,
  });
});

const getAllUserProgress = catchAsync(async (req, res) => {
  const result = await UserProgressService.getAllUserProgress(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User Progresses are retrieved successfully",
    meta: result.meta,
    data: result.result,
  });
});

const updateUserProgress = catchAsync(async (req, res) => {
  const { userId, courseId, ...payload } = req.body;

  const result = await UserProgressService.updateUserProgress(
    userId,
    courseId,
    payload
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User Progress updated successfully",
    data: result,
  });
});

export const UserProgressController = {
  createUserProgress,
  getUserProgressByCourse,
  getAllUserProgress,
  updateUserProgress,
};
