import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppShell from "../../components/layout/AppShell";
import LoginPage from "../../pages/Login/LoginPage";
import AdminDashboardPage from "../../pages/Admin/AdminDashboardPage";
import UsersPage from "../../pages/Admin/UsersPage";
import MentorDashboardPage from "../../pages/Mentor/MentorDashboardPage";
import MentorReviewPage from "../../pages/Mentor/MentorReviewPage";
import MentorSubmissionsPage from "../../pages/Mentor/MentorSubmissionsPage";
import NotFoundPage from "../../pages/NotFound/NotFoundPage";
import CheckoutPage from "../../pages/Public/CheckoutPage";
import CourseDetailsPage from "../../pages/Public/CourseDetailsPage";
import CoursesPage from "../../pages/Public/CoursesPage";
import HomePage from "../../pages/Public/HomePage";
import RegistrationPage from "../../pages/Registration/RegistrationPage";
import ConfirmationPage from "../../pages/Confirmation/ConfirmationPage";
import AssignmentPage from "../../pages/Student/AssignmentPage";
import LearningPage from "../../pages/Student/LearningPage";
import MyCoursesPage from "../../pages/Student/MyCoursesPage";
import ProfilePage from "../../pages/Student/ProfilePage";
import StudentDashboardPage from "../../pages/Student/StudentDashboardPage";
import UploadProjectPage from "../../pages/Student/UploadProjectPage";

export default function AppRouter() { return <BrowserRouter><Routes><Route element={<AppShell />}>
    <Route path="/" element={<HomePage />} /><Route path="/courses" element={<CoursesPage />} /><Route path="/courses/:courseId" element={<CourseDetailsPage />} /><Route path="/checkout/:courseId" element={<CheckoutPage />} />
    <Route path="/student" element={<StudentDashboardPage />} /><Route path="/student/courses" element={<MyCoursesPage />} /><Route path="/student/learning/:courseId" element={<LearningPage />} /><Route path="/student/learning/:courseId/lesson/:lessonId" element={<LearningPage />} /><Route path="/student/lesson/:lessonId" element={<LearningPage />} /><Route path="/student/assignments/:assignmentId" element={<AssignmentPage />} /><Route path="/student/upload/:assignmentId" element={<UploadProjectPage />} /><Route path="/student/profile" element={<ProfilePage />} />
    <Route path="/mentor" element={<MentorDashboardPage />} /><Route path="/mentor/submissions" element={<MentorSubmissionsPage />} /><Route path="/mentor/review/:submissionId" element={<MentorReviewPage />} />
    <Route path="/admin" element={<AdminDashboardPage />} /><Route path="/admin/users" element={<UsersPage />} />
</Route><Route path="/login" element={<LoginPage />} /><Route path="/registration" element={<RegistrationPage />} /><Route path="/confirm-email/:code" element={<ConfirmationPage />} /><Route path="/not-found" element={<NotFoundPage />} /><Route path="*" element={<Navigate to="/not-found" replace />} /></Routes></BrowserRouter>; }
