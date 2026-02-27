import { Router, Request, Response } from "express";
import {
  createAttraction,
  getAllAttractions,
  getAttractionById,
  updateAttractionById,
  deleteAttractionById,
  getAttractionsByQuery,
  getAttractionsByQueryGeneric,
} from "./controllers/attractionController";
import {
  loginUser,
  registerUser,
  verifyToken,
} from "./controllers/authController";

const router: Router = Router();


router.get("/", (req: Request, res: Response) => {
  // connect
  res.status(200).send("Welcome to the AroundYou API");
  // disconnect
});


router.post("/user/register", registerUser);
router.post("/user/login", loginUser);


router.post("/products", verifyToken, createAttraction);
router.get("/products", getAllAttractions);
router.get("/products/:id", getAttractionById);


router.post("/products/query", getAttractionsByQueryGeneric);
router.get("/products/:key/:value", verifyToken, getAttractionsByQuery);


router.put("/products/:id", updateAttractionById);
router.delete("/products/:id", deleteAttractionById);

export default router;
