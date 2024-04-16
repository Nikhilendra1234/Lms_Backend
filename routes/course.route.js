import { Router } from "express";
import { getAllCourses, getLecturesById } from "../Controllers/course.controller.js";

const courseRouter=Router();

courseRouter.route('/').get(getAllCourses);

courseRouter.route('/:id').get(getLecturesById);


export default courseRouter