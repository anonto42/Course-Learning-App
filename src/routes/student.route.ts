import { Router } from "express";
import { AnswerAQuize, EnrollCourse, FollowCourseCreator, GiveFeedBackCourse, LikeCourse, Login, Register } from "../controllers/student.controller";
import { getToken } from "../middleware/auth.middleware";
import { GetCourses } from "../controllers/teacher.controller";

const StudentRouter = Router();

// Create accout
StudentRouter
    .route("/register")
    .post(Register);
// Login accout
StudentRouter
    .route("/login")
    .post(Login);
// Get Courcess
StudentRouter
    .route("/course")
    .get(GetCourses)
// This next routs you should use your account
StudentRouter.use(getToken);
// Like Cources
StudentRouter
    .route("/like")
    .post(LikeCourse)
// give a feedBack to a course
StudentRouter
    .route("/feedback")
    .post(GiveFeedBackCourse)
// This route is for folow the creator of the corse
StudentRouter
    .route("/follow")
    .post(FollowCourseCreator)
// Answer a quize
StudentRouter
    .route("/answer")
    .post(AnswerAQuize)
// Enroll a course
StudentRouter
    .route("/enroll")
    .post(EnrollCourse)


export default StudentRouter;