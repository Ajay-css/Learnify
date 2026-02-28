import express from "express";
import cors from "cors";
import courseRoutes from "./routes/course.routes.js";
import zaraRoutes from "./routes/zara.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/courses", courseRoutes);
app.use("/api/zara", zaraRoutes);

app.use(errorHandler);

export default app;