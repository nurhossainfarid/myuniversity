import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { StudentRoutes } from "../modules/student/student.route";
import { SemesterRoutes } from "../modules/academicSemester/semester.route";
import { FacultyRoutes } from "../modules/academicFaculty/faculty.route";
import { DepartmentRoutes } from "../modules/academicDepartment/department.route";
import { FacultyMembersRoutes } from "../modules/FacultyMember/FacultyMember.route";
import { CourseRoutes } from "../modules/Course/course.route";
import { SemesterRegistrationRoutes } from "../modules/semesterRegistration/semesterRegistration.route";
import { OfferedCourseRoutes } from "../modules/offeredCourse/offeredCourse.route";

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
        path: '/faculties',
        route: FacultyMembersRoutes
    },
    {
        path: '/semesters',
        route: SemesterRoutes
    },
    {
        path: '/academicFaculty',
        route: FacultyRoutes
    },
    {
        path: '/departments',
        route: DepartmentRoutes
    },
    {
        path: '/courses',
        route: CourseRoutes
    },
    {
        path: '/semesterRegistrations',
        route: SemesterRegistrationRoutes
    },
    {
        path: '/offeredCourses',
        route: OfferedCourseRoutes
    },

]

moduleRoutes.forEach(r => router.use(r.path, r.route));

export default router;