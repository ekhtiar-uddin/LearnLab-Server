// services/userProgress.service.ts

import { Types } from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { IUserProgress } from "./userProgress.interface";
import UserProgress from "./userProgress.model";

const createUserProgress = async (userProgressData: Partial<IUserProgress>) => {
  // Check if progress already exists for this user and course
  const existingProgress = await UserProgress.findOne({
    userId: userProgressData.userId,
    courseId: userProgressData.courseId,
  });

  if (existingProgress) {
    // Return existing progress instead of throwing error
    return existingProgress;
  }

  const userProgress = await UserProgress.create(userProgressData);
  return userProgress;
};

const getUserProgressByCourse = async (userId: string, courseId: string) => {
  const progress = await UserProgress.findOne({
    userId: new Types.ObjectId(userId),
    courseId: new Types.ObjectId(courseId),
  })
    .populate("currentLecture")
    .populate("completedLectures")
    .lean();

  return progress;
};

const getAllUserProgress = async (query: Record<string, unknown>) => {
  const { userId, courseId, ...pQuery } = query;

  const filter: Record<string, any> = {};

  if (userId) {
    filter.userId = userId;
  }

  if (courseId) {
    filter.courseId = courseId;
  }

  const productQuery = new QueryBuilder(UserProgress.find(filter), pQuery)
    .filter()
    .sort()
    .paginate()
    .fields();

  const data = await productQuery.modelQuery
    .populate("currentLecture")
    .populate("completedLectures")
    .lean();

  const meta = await productQuery.countTotal();

  return {
    meta,
    result: data,
  };
};

const updateUserProgress = async (
  userId: string,
  courseId: string,
  payload: {
    currentLecture: string;
    nextLecture?: string;
    totalLectures: number;
  }
) => {
  const currentLectureId = new Types.ObjectId(payload.currentLecture);
  const nextLectureId = payload.nextLecture
    ? new Types.ObjectId(payload.nextLecture)
    : null;

  // Find or create user progress
  let progress = await UserProgress.findOne({
    userId: new Types.ObjectId(userId),
    courseId: new Types.ObjectId(courseId),
  });

  if (!progress) {
    // Create new progress
    progress = await UserProgress.create({
      userId: new Types.ObjectId(userId),
      courseId: new Types.ObjectId(courseId),
      currentLecture: nextLectureId || currentLectureId,
      completedLectures: [currentLectureId],
      unlockedLectures: nextLectureId
        ? [currentLectureId, nextLectureId]
        : [currentLectureId],
      progressPercentage: Math.round((1 / payload.totalLectures) * 100),
      lastAccessedAt: new Date(),
    });
  } else {
    // Update existing progress
    const updateData: any = {
      currentLecture: nextLectureId || currentLectureId,
      lastAccessedAt: new Date(),
      $addToSet: {
        completedLectures: currentLectureId,
        unlockedLectures: currentLectureId,
      },
    };

    if (nextLectureId) {
      updateData.$addToSet.unlockedLectures = {
        $each: [currentLectureId, nextLectureId],
      };
    }

    progress = await UserProgress.findOneAndUpdate(
      {
        userId: new Types.ObjectId(userId),
        courseId: new Types.ObjectId(courseId),
      },
      updateData,
      { new: true }
    );

    // Calculate progress percentage
    if (progress) {
      const completedCount = progress.completedLectures.length;
      progress.progressPercentage = Math.round(
        (completedCount / payload.totalLectures) * 100
      );
      await progress.save();
    }
  }

  return progress;
};

export const UserProgressService = {
  createUserProgress,
  getUserProgressByCourse,
  getAllUserProgress,
  updateUserProgress,
};
