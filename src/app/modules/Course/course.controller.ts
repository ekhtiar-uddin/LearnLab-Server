import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { IImageFile } from "../../interface/IImageFile";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ProductService } from "./course.service";
// req.user as IJwtPayload
const createProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.createProduct(
    req.body,
    req.file as IImageFile
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product created successfully",
    data: result,
  });
});

const getAllProduct = catchAsync(async (req, res) => {
  const result = await ProductService.getAllProduct(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Products are retrieved successfully",
    meta: result.meta,
    data: result.result,
  });
});

const getSingleProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await ProductService.getSingleProduct(productId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product retrieved successfully",
    data: result,
  });
});
const getCourseWithModulesAndLectures = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await ProductService.getCourseWithModulesAndLectures(
    productId
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product retrieved successfully",
    data: result,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const {
    user,
    body: payload,
    params: { productId },
  } = req;

  const result = await ProductService.updateProduct(
    productId,
    payload,
    req.file as IImageFile
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product updated successfully",
    data: result,
  });
});

// hard delete
const deleteProduct = catchAsync(async (req, res) => {
  const {
    params: { productId },
  } = req;

  const result = await ProductService.deleteProduct(productId, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product deleted successfully",
    data: result,
  });
});

export const ProductController = {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getCourseWithModulesAndLectures,
};
