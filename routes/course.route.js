import { Router } from "express";
import { getAllCourses, getLecturesById ,createCourse,updateCourse,removeCourse, addLecturesToCourse} from "../Controllers/course.controller.js";
import upload from '../middlewares/multer.middleware.js'
import { authoriseRoles, isLoggedIn } from "../middlewares/auth.middleware.js";
const courseRouter=Router();

courseRouter.route('/')
.get(isLoggedIn,getAllCourses)
.post(
    isLoggedIn,
    authoriseRoles("ADMIN"),
    upload.single('thumbnail'),
    createCourse);

courseRouter.route('/:id')
.get(isLoggedIn,getLecturesById)
.put(
    isLoggedIn,
    authoriseRoles('ADMIN'),
    updateCourse)
.delete(
    isLoggedIn,
    authoriseRoles('ADMIN'),
    removeCourse
    )
    .post(
        isLoggedIn,
        authoriseRoles('ADMIN'),
        addLecturesToCourse
    );


export default courseRouter