import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '../shared/ThemeContext';
import { ScrollToTopOnNav, ScrollToTopButton } from '../shared/components/layout/ScrollToTop';
import { PageSkeleton } from '../shared/components/layout/Skeleton';
import { AuthProvider } from '../features/auth/context/AuthContext';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';

// Layouts
const PublicLayout = lazy(() => import('../public/layout/PublicLayout'));
const StudentLayout = lazy(() => import('../student/layout/StudentLayout'));
const AdminLayout = lazy(() => import('../admin/layout/AdminLayout'));

// Public Pages
const Home = lazy(() => import('../public/pages/Home'));
const Results = lazy(() => import('../public/pages/Results'));
const Program = lazy(() => import('../public/pages/Program'));
const About = lazy(() => import('../public/pages/About'));
const Blog = lazy(() => import('../public/pages/Blog'));
const LegalNotice = lazy(() => import('../public/pages/LegalNotice'));
const PrivacyPolicy = lazy(() => import('../public/pages/PrivacyPolicy'));
const NotFound = lazy(() => import('../public/pages/NotFound'));

// Auth Pages
const LoginPage = lazy(() => import('../features/auth/pages/Login'));
const RegisterPage = lazy(() => import('../features/auth/pages/Register'));
const OTPVerificationPage = lazy(() => import('../features/auth/pages/OTPVerification'));
const ForgotPasswordPage = lazy(() => import('../features/auth/pages/ForgotPassword'));

// Student Pages
const StudentDashboard = lazy(() => import('../student/pages/Dashboard'));
const StudentProfile = lazy(() => import('../student/pages/ProfileComplete'));
const StudentExams = lazy(() => import('../student/pages/Exams'));
const StudentExamSession = lazy(() => import('../student/pages/ExamSession'));
const StudentResults = lazy(() => import('../student/pages/Results'));
const StudentResources = lazy(() => import('../student/pages/Resources'));
const StudentSettings = lazy(() => import('../student/pages/Settings'));

// Admin Pages
const AdminDashboard = lazy(() => import('../admin/pages/Dashboard'));
const AdminUsers = lazy(() => import('../admin/pages/Users'));
const AdminStudents = lazy(() => import('../admin/pages/Students'));
const AdminCandidates = lazy(() => import('../admin/pages/Candidates'));
const AdminQCM = lazy(() => import('../admin/pages/QCM'));
const AdminContent = lazy(() => import('../admin/pages/Content'));
const AdminStatistics = lazy(() => import('../admin/pages/Statistics'));
const AdminResults = lazy(() => import('../admin/pages/Results'));
const AdminSettings = lazy(() => import('../admin/pages/Settings'));

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTopOnNav />
          <Suspense fallback={<PageSkeleton />}>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/programme" element={<Program />} />
                <Route path="/resultats" element={<Results />} />
                <Route path="/a-propos" element={<About />} />
                <Route path="/actualites" element={<Blog />} />
                <Route path="/mentions-legales" element={<LegalNotice />} />
                <Route path="/politique-confidentialite" element={<PrivacyPolicy />} />
              </Route>

              {/* Auth Routes */}
              <Route path="/connexion" element={<LoginPage />} />
              <Route path="/inscription" element={<RegisterPage />} />
              <Route path="/verification-email" element={<OTPVerificationPage />} />
              <Route path="/mot-de-passe-oublie" element={<ForgotPasswordPage />} />

              {/* Student Routes */}
              <Route
                path="/etudiant"
                element={
                  <ProtectedRoute>
                    <StudentLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<StudentDashboard />} />
                <Route path="profil" element={<StudentProfile />} />
                <Route path="epreuves" element={<StudentExams />} />
                <Route path="epreuves/:examId" element={<StudentExamSession />} />
                <Route path="resultats" element={<StudentResults />} />
                <Route path="ressources" element={<StudentResources />} />
                <Route path="parametres" element={<StudentSettings />} />
              </Route>

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="utilisateurs" element={<AdminUsers />} />
                <Route path="etudiants" element={<AdminStudents />} />
                <Route path="candidatures" element={<AdminCandidates />} />
                <Route path="qcm" element={<AdminQCM />} />
                <Route path="contenu" element={<AdminContent />} />
                <Route path="statistiques" element={<AdminStatistics />} />
                <Route path="resultats" element={<AdminResults />} />
                <Route path="parametres" element={<AdminSettings />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <ScrollToTopButton />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
