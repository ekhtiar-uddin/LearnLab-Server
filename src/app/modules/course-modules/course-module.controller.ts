import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CourseModuleService } from "./course-module.service";

const createCourseModule = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseModuleService.createCourseModule(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Course Module created successfully",
    data: result,
  });
});

const getAllCourseModules = catchAsync(async (req, res) => {
  const courseId = req.params?.courseId;

  console.log("courseId:", courseId);

  const result = await CourseModuleService.getAllCourseModules(
    courseId,
    req.query
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Course Modules are retrieved successfully",
    meta: result.meta,
    data: result.result,
  });
});

const updateCourseModule = catchAsync(async (req, res) => {
  const {
    body: payload,
    params: { moduleId },
  } = req;

  const result = await CourseModuleService.updateCourseModule(
    moduleId,
    payload
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Module updated successfully",
    data: result,
  });
});

const deleteCourseModule = catchAsync(async (req, res) => {
  const moduleId = req.params.moduleId;
  const result = await CourseModuleService.deleteCourseModule(
    moduleId,
    req.body
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: `Module has been deleted`,
    data: result,
  });
});

export const CourseModuleController = {
  createCourseModule,
  getAllCourseModules,
  updateCourseModule,
  deleteCourseModule,
};
