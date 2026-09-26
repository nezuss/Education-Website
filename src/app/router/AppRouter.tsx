import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppShell from "../../components/layout/AppShell";
import PublicLayout from "../../components/layout/PublicLayout";
import ProtectedRoute from "../../components/auth/ProtectedRoute";

/* ── Public ─────────────────────────────────────────── */
const HomePage = lazy(() => import("../../pages/Public/HomePage"));
const CoursesPage = lazy(() => import("../../pages/Public/CoursesPage"));
const CourseDetailsPage = lazy(() => import("../../pages/Public/CourseDetailsPage"));
const CheckoutPage = lazy(() => import("../../pages/Public/CheckoutPage"));
const SuccessPage = lazy(() => import("../../pages/Public/SuccessPage"));
const CancelPage = lazy(() => import("../../pages/Public/CancelPage"));
const EcoJournalPage = lazy(() => import("../../pages/Public/EcoJournalPage"));
const ArticleDetailsPage = lazy(() => import("../../pages/Public/ArticleDetailsPage"));
const ContactsPage = lazy(() => import("../../pages/Public/ContactsPage"));
const FaqPage = lazy(() => import("../../pages/Public/FaqPage"));
const CommunityPage = lazy(() => import("../../pages/Public/CommunityPage"));
const PortfolioPage = lazy(() => import("../../pages/Public/PortfolioPage"));
const AboutPage = lazy(() => import("../../pages/Public/AboutPage"));

/* ── Auth ───────────────────────────────────────────── */
const LoginPage = lazy(() => import("../../pages/Login/LoginPage"));
const RegistrationPage = lazy(() => import("../../pages/Registration/RegistrationPage"));
const ConfirmationPage = lazy(() => import("../../pages/Confirmation/ConfirmationPage"));
const ChooseRolePage = lazy(() => import("../../pages/Auth/ChooseRolePage"));
const ForgotPasswordPage = lazy(() => import("../../pages/Auth/ForgotPasswordPage"));

/* ── Student ────────────────────────────────────────── */
const StudentDashboardPage = lazy(() => import("../../pages/Student/StudentDashboardPage"));
const MyCoursesPage = lazy(() => import("../../pages/Student/MyCoursesPage"));
const LearningPage = lazy(() => import("../../pages/Student/LearningPage"));
const AssignmentPage = lazy(() => import("../../pages/Student/AssignmentPage"));
const UploadProjectPage = lazy(() => import("../../pages/Student/UploadProjectPage"));
const ProfilePage = lazy(() => import("../../pages/Student/ProfilePage"));

/* ── Mentor ─────────────────────────────────────────── */
const MentorDashboardPage = lazy(() => import("../../pages/Mentor/MentorDashboardPage"));
const MentorSubmissionsPage = lazy(() => import("../../pages/Mentor/MentorSubmissionsPage"));
const MentorReviewPage = lazy(() => import("../../pages/Mentor/MentorReviewPage"));
const MentorProfilePage = lazy(() => import("../../pages/Mentor/MentorProfilePage"));

/* ── Admin ──────────────────────────────────────────── */
const AdminDashboardPage = lazy(() => import("../../pages/Admin/AdminDashboardPage"));
const UsersPage = lazy(() => import("../../pages/Admin/UsersPage"));
const CoursesManagePage = lazy(() => import("../../pages/Admin/CoursesManagePage"));
const OrdersPage = lazy(() => import("../../pages/Admin/OrdersPage"));
const AnalyticsPage = lazy(() => import("../../pages/Admin/AnalyticsPage"));
const AdminProfilePage = lazy(() => import("../../pages/Admin/AdminProfilePage"));

/* ── Other ──────────────────────────────────────────── */
const NotFoundPage = lazy(() => import("../../pages/NotFound/NotFoundPage"));

function PageLoader() {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            gap: "12px",
            color: "var(--color-brand-dark, #0A2D1B)",
            fontFamily: "var(--font-body, 'Inter', sans-serif)",
            fontSize: "15px",
            fontWeight: 500,
        }}>
            <span style={{
                width: "28px",
                height: "28px",
                border: "3px solid rgba(19, 73, 44, 0.15)",
                borderTopColor: "var(--color-brand-primary, #13492C)",
                borderRadius: "50%",
                animation: "spin .7s linear infinite",
            }} />
            Завантаження…
        </div>
    );
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    
                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/courses" element={<CoursesPage />} />
                        <Route path="/courses/:courseId" element={<CourseDetailsPage />} />
                        <Route path="/checkout/:courseId" element={<CheckoutPage />} />
                        <Route path="/success" element={<SuccessPage />} />
                        <Route path="/cancel" element={<CancelPage />} />
                        <Route path="/journal" element={<EcoJournalPage />} />
                        <Route path="/journal/:articleId" element={<ArticleDetailsPage />} />
                        <Route path="/contacts" element={<ContactsPage />} />
                        <Route path="/faq" element={<FaqPage />} />
                        <Route path="/community" element={<CommunityPage />} />
                        <Route path="/portfolio" element={<PortfolioPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/registration" element={<RegistrationPage />} />
                        <Route path="/choose-role" element={<ChooseRolePage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    </Route>

                    <Route element={<AppShell />}>

                        <Route element={<ProtectedRoute />}>
                            <Route path="/student" element={<StudentDashboardPage />} />
                            <Route path="/student/courses" element={<MyCoursesPage />} />
                            <Route path="/student/learning/:courseId" element={<LearningPage />} />
                            <Route path="/student/learning/:courseId/lesson/:lessonId" element={<LearningPage />} />
                            <Route path="/student/lesson/:lessonId" element={<LearningPage />} />
                            <Route path="/student/assignments/:assignmentId" element={<AssignmentPage />} />
                            <Route path="/student/upload/:assignmentId" element={<UploadProjectPage />} />
                            <Route path="/student/profile" element={<ProfilePage />} />
                            <Route path="/student/progress" element={<Navigate to="/student" replace />} />
                            <Route path="/student/schedule" element={<Navigate to="/student" replace />} />
                            <Route path="/student/reviews" element={<Navigate to="/student" replace />} />
                        </Route>

                        <Route element={<ProtectedRoute allowedRoles={["Teacher", "Admin"]} />}>
                            <Route path="/mentor" element={<MentorDashboardPage />} />
                            <Route path="/mentor/submissions" element={<MentorSubmissionsPage />} />
                            <Route path="/mentor/review/:submissionId" element={<MentorReviewPage />} />
                            <Route path="/mentor/profile" element={<MentorProfilePage />} />
                        </Route>

                        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
                            <Route path="/admin" element={<AdminDashboardPage />} />
                            <Route path="/admin/users" element={<UsersPage />} />
                            <Route path="/admin/courses" element={<CoursesManagePage />} />
                            <Route path="/admin/orders" element={<OrdersPage />} />
                            <Route path="/admin/analytics" element={<AnalyticsPage />} />
                            <Route path="/admin/profile" element={<AdminProfilePage />} />
                        </Route>
                    </Route>

                    <Route path="/confirm-email" element={<ConfirmationPage />} />
                    <Route path="/confirm-email/:code" element={<ConfirmationPage />} />
                    <Route path="/not-found" element={<NotFoundPage />} />
                    <Route path="*" element={<Navigate to="/not-found" replace />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

