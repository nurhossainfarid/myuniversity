import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { StudentRoutes } from "../modules/student/student.route";
import { SemesterRoutes } from "../modules/academicSemester/semester.route";
import { FacultyRoutes } from "../modules/faculty/faculty.route";
import { DepartmentRoutes } from "../modules/department/department.route";

const router = Router();

const moduleRoutes = [
    {
        path: '/users',
        route: UserRoutes
    },
    {
        path: '/students',
        route: StudentRoutes
    },
    {
        path: '/semesters',
        route: SemesterRoutes
    },
    {
        path: '/faculties',
        route: FacultyRoutes
    },
    {
        path: '/departments',
        route: DepartmentRoutes
    },
]

moduleRoutes.forEach(r => router.use(r.path, r.route));

export default router;