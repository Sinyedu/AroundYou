import router from "./routes";

import { getMe } from "../controllers/authController";
import { verifyToken } from "../middleware/verifyUserToken";

router.get("/me", verifyToken, getMe);
