import { Router } from "express";
import { CreateCorse, GetCourses, MakeUserToTecher, AddCourseContent, DeleteCource } from "../controllers/teacher.controller";
import { getToken, isTeacher } from "../middleware/auth.middleware";

const TechersRouter = Router();

// You must have a account to access this routess
TechersRouter.use(getToken);
// Convert normal user to a Teacher
TechersRouter
    .route("/create-teacher")
    .post(MakeUserToTecher);
// If you ara teacher then you will access this routess
TechersRouter.use(isTeacher);
// Create course and manage corcess informations
TechersRouter
    .route("/course")
    .get(GetCourses) // get all Cours
    .post(CreateCorse) // Create user
    .put(AddCourseContent) // customize
    .delete(DeleteCource) // delete

export default TechersRouter