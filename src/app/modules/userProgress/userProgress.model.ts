import { model, Schema } from "mongoose";
import { IUserProgress } from "./userProgress.interface";

const userProgressSchema = new Schema<IUserProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    currentLecture: {
      type: Schema.Types.ObjectId,
      ref: "lecture",
      default: null,
    },
    completedLectures: [
      {
        type: Schema.Types.ObjectId,
        ref: "lecture",
      },
    ],
    unlockedLectures: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],
    progressPercentage: {
      type: Number,
      default: 0,
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one progress per user per course
userProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const UserProgress = model<IUserProgress>("UserProgress", userProgressSchema);

export default UserProgress;
