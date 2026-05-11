import { Router } from "express";
import { createContactTicket } from "../controllers/contactTicketController";
import { contactRateLimiter } from "../middleware/rateLimit";
import { verifyToken } from "../middleware/verifyUserToken";

const router = Router();

router.post("/contact/tickets", verifyToken, contactRateLimiter, createContactTicket);

export default router;
