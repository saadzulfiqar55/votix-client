import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import AdminLayout from "./components/AdminLayout";
import HomePage from "./components/HomePage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import VoterDashboard from "./pages/VoterDashboard";
import VotingPage from "./pages/VotingPage";
import VotingConfirmation from "./pages/VotingConfirmation";
import ResultsPage from "./pages/ResultsPage";
import Elections from "./pages/Elections";
import ElectionDetails from "./pages/ElectionDetails";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ElectionsManagement from "./pages/admin/ElectionsManagement";
import CreateElection from "./pages/admin/CreateElection";
import CandidateManagement from "./pages/admin/CandidateManagement";
import ConstituencyManagement from "./pages/admin/ConstituencyManagement";
import VoterManagement from "./pages/admin/VoterManagement";
import AdminResults from "./pages/admin/AdminResults";
import AuditLogs from "./pages/admin/AuditLogs";
import PollingOfficerDashboard from "./pages/admin/PollingOfficerDashboard";
import ElectionManagerDashboard from "./pages/admin/ElectionManagerDashboard";
import ResultReview from "./pages/admin/ResultReview";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Header />
      <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />

            {/* Voter Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><VoterDashboard /></ProtectedRoute>} />
            <Route path="/vote" element={<ProtectedRoute><VotingPage /></ProtectedRoute>} />
            <Route path="/vote/confirmation" element={<ProtectedRoute><VotingConfirmation /></ProtectedRoute>} />
            <Route path="/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
            <Route path="/elections" element={<ProtectedRoute><Elections /></ProtectedRoute>} />
            <Route path="/elections/:id" element={<ProtectedRoute><ElectionDetails /></ProtectedRoute>} />

            {/* Polling Officer Routes */}
            <Route path="/officer" element={
              <ProtectedRoute allowedRoles={["polling_officer", "super_admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<PollingOfficerDashboard />} />
            </Route>

            {/* Election Manager Routes */}
            <Route path="/manager" element={
              <ProtectedRoute allowedRoles={["election_manager", "super_admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<ElectionManagerDashboard />} />
              <Route path="review" element={<ResultReview />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={["super_admin", "election_admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="elections" element={<ElectionsManagement />} />
              <Route path="elections/new" element={<CreateElection />} />
              <Route path="elections/:id/edit" element={<CreateElection />} />
              <Route path="elections/:id/candidates" element={<CandidateManagement />} />
              <Route path="constituencies" element={<ConstituencyManagement />} />
              <Route path="voters" element={<VoterManagement />} />
              <Route path="results" element={<AdminResults />} />
              <Route path="audit-logs" element={<AuditLogs />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
    </div>
  );
}
