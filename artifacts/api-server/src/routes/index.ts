import { Router, type IRouter } from "express";
import healthRouter from "./health";
import enquiriesRouter from "./enquiries.js";
import adminRouter from "./admin.js";
import workersRouter from "./workers.js";
import repliesRouter from "./replies.js";
import templatesRouter from "./templates.js";
import notificationsRouter from "./notifications.js";
import stockRouter from "./stock.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(adminRouter);
router.use(workersRouter);
router.use(enquiriesRouter);
router.use(repliesRouter);
router.use(templatesRouter);
router.use(notificationsRouter);
router.use(stockRouter);

export default router;
