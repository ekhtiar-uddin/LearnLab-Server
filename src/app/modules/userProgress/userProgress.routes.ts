import { Router } from "express";

import { UserProgressController } from "./userProgress.controller";

const router = Router();
router.post(
  "/create",

  UserProgressController.createUserProgress
);

router.get(
  "/by-course",

  UserProgressController.getUserProgressByCourse
);

router.get(
  "/",

  UserProgressController.getAllUserProgress
);

router.patch(
  "/update",

  UserProgressController.updateUserProgress
);

export const UserProgressRoutes = router;
