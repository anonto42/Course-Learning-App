import { Router } from "express";
import { Login, Register } from "../controllers/student.controller";
import { getToken } from "../middleware/auth.middleware";


const StudentRouter = Router();

// Create accout
StudentRouter.route("/register").post(Register);
// Login accout
StudentRouter.route("/login").post(Login);

export default StudentRouter;