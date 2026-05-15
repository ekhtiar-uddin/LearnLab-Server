// models/userProgress.interface.ts

import { Types } from "mongoose";

export interface IUserProgress {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  currentLecture?: Types.ObjectId | null;
  completedLectures: Types.ObjectId[];
  unlockedLectures: Types.ObjectId[];
  progressPercentage: number;
  lastAccessedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
