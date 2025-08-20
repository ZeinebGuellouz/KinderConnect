import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  createAbsence,
  getChildAbsences,
  getAbsenceNotifications,
  markNotificationRead
} from "./routes/absence";
import { getChildAttendance } from "./routes/attendance";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Absence management routes
  app.post("/api/absence", createAbsence);
  app.get("/api/absence/child/:childId", getChildAbsences);
  app.get("/api/absence/notifications", getAbsenceNotifications);
  app.put("/api/absence/notifications/:notificationId/read", markNotificationRead);

  // Attendance statistics routes
  app.get("/api/attendance/child/:childId", getChildAttendance);

  return app;
}
