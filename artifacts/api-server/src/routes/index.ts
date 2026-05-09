import { Router, type IRouter } from "express";
import healthRouter from "./health";
import enquiriesRouter from "./enquiries.js";
import adminRouter from "./admin.js";
import workersRouter from "./workers.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(adminRouter);
router.use(workersRouter);
router.use(enquiriesRouter);

export default router;
