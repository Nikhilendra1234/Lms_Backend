import { Router } from "express";
import { getAllCourses, getLecturesById ,createCourse,updateCourse,removeCourse} from "../Controllers/course.controller.js";
import upload from '../middlewares/multer.middleware.js'
const courseRouter=Router();

courseRouter.route('/')
.get(getAllCourses)
.post(upload.single('thumbnail'),createCourse);

courseRouter.route('/:id')
.get(getLecturesById)
.put(updateCourse)
.delete(removeCourse);


export default courseRouter