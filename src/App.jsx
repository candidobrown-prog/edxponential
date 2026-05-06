import React from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import AppLayout from './components/layout/AppLayout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Coaching from './pages/Coaching';
import CoachingDetail from './pages/CoachingDetail';
import EdVisors from './pages/EdVisors';
import EdVisorDetail from './pages/EdVisorDetail';
import EdVestors from './pages/EdVestors';
import DealRoom from './pages/DealRoom';
import DealDetail from './pages/DealDetail';
import Pipeline from './pages/Pipeline';
import FounderDashboard from './pages/FounderDashboard';
import Pricing from './pages/Pricing';
import Communities from './pages/Communities';
import CommunityDetail from './pages/CommunityDetail';
import Profile from './pages/Profile';
import InvestorProfile from './pages/InvestorProfile';
import MatchedOpportunities from './pages/MatchedOpportunities';
import MatchedEdVestors from './pages/MatchedEdVestors';
import AdminMatchControl from './pages/AdminMatchControl';
import TwotrXHome from './pages/twotrx/TwotrXHome';
import TwotrXLayout from './components/twotrx/TwotrXLayout';
import SchoolDashboard from './pages/twotrx/SchoolDashboard';
import ParentDashboard from './pages/twotrx/ParentDashboard';
import TutorDashboard from './pages/twotrx/TutorDashboard';
import TwotrXAdminDashboard from './pages/twotrx/TwotrXAdminDashboard';
import ReferStudent from './pages/twotrx/ReferStudent';
import TutorMarketplace from './pages/twotrx/TutorMarketplace';
import TutorApply from './pages/twotrx/TutorApply';
import StudentReferrals from './pages/twotrx/StudentReferrals';
import TutorRequests from './pages/twotrx/TutorRequests';
import MatchingDashboard from './pages/MatchingDashboard';
import OneJobHome from './pages/onejob/OneJobHome';
import JobBoard from './pages/onejob/JobBoard';
import EmployerDashboard from './pages/onejob/EmployerDashboard';
import PostJob from './pages/onejob/PostJob';
import JobSeekerDashboard from './pages/onejob/JobSeekerDashboard';
import OneJobPricing from './pages/onejob/OneJobPricing';
import OneJobAdmin from './pages/onejob/OneJobAdmin';
import EdXportanteHome from './pages/edxportante/EdXportanteHome';
import ContentGenerator from './pages/edxportante/ContentGenerator';
import ContentMarketplace from './pages/edxportante/ContentMarketplace';
import EdXportanteDashboard from './pages/edxportante/EdXportanteDashboard';
import Xschetails from './pages/Xschetails';
import XschetailsDashboard from './pages/XschetailsDashboard';
import PlatformChatbot from './components/platform/PlatformChatbot';
import AskEddy from './components/eddy/AskEddy';
import AdminFeedback from './pages/AdminFeedback';
import MyXschool from './pages/MyXschool';
import NotificationPrefs from './pages/NotificationPrefs';
import AdminEnterprise from './pages/AdminEnterprise';
import TubedXHome from './pages/tubedx/TubedXHome';
import TubedXDashboard from './pages/tubedx/TubedXDashboard';
import TubedXVideos from './pages/tubedx/TubedXVideos';
import TubedXEvents from './pages/tubedx/TubedXEvents';
import TubedXAnalytics from './pages/tubedx/TubedXAnalytics';
import TubedXAIStudio from './pages/tubedx/TubedXAIStudio';
import TubedXOTT from './pages/tubedx/TubedXOTT';
import WelcomeScreen from './components/platform/WelcomeScreen';
import OnboardingFlow from './components/platform/OnboardingFlow';
import XschoresHome from './pages/xschores/XschoresHome';
import XschoresLayout from './components/xschores/XschoresLayout';
import XschoresDashboard from './pages/xschores/XschoresDashboard';
import XschoresStudents from './pages/xschores/XschoresStudents';
import XschoresAlerts from './pages/xschores/XschoresAlerts';
import XschoresBenchmarks from './pages/xschores/XschoresBenchmarks';
import XschoresCultureLog from './pages/xschores/XschoresCultureLog';
import XschoresReports from './pages/xschores/XschoresReports';
import { AnimatePresence } from 'framer-motion';

const WELCOME_KEY = 'edx_welcome_shown';
const ONBOARDING_KEY = 'edx_onboarding_complete';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const [showOnboarding, setShowOnboarding] = React.useState(false);
  const [showWelcome, setShowWelcome] = React.useState(false);

  React.useEffect(() => {
    if (!localStorage.getItem(ONBOARDING_KEY)) {
      setTimeout(() => setShowOnboarding(true), 800);
    } else if (!localStorage.getItem(WELCOME_KEY)) {
      setTimeout(() => setShowWelcome(true), 800);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setShowOnboarding(false);
    if (!localStorage.getItem(WELCOME_KEY)) {
      setTimeout(() => setShowWelcome(true), 400);
    }
  };

  const handleWelcomeChoice = (choice) => {
    localStorage.setItem(WELCOME_KEY, choice);
    setShowWelcome(false);
  };

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <>
    <AnimatePresence>
      {showOnboarding && <OnboardingFlow onComplete={handleOnboardingComplete} />}
    </AnimatePresence>
    <AnimatePresence>
      {showWelcome && <WelcomeScreen onChoice={handleWelcomeChoice} />}
    </AnimatePresence>
    <Routes>
      <Route path="/welcome" element={<Landing />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/coaching" element={<Coaching />} />
        <Route path="/coaching/:id" element={<CoachingDetail />} />
        <Route path="/edvisors" element={<EdVisors />} />
        <Route path="/edvisors/:id" element={<EdVisorDetail />} />
        <Route path="/communities" element={<Communities />} />
        <Route path="/communities/:id" element={<CommunityDetail />} />
        <Route path="/edvestors" element={<EdVestors />} />
        <Route path="/deal-room" element={<DealRoom />} />
        <Route path="/deal-room/:id" element={<DealDetail />} />
        <Route path="/pipeline" element={<Pipeline />} />
        <Route path="/founder-dashboard" element={<FounderDashboard />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/investor-profile" element={<InvestorProfile />} />
        <Route path="/matched-opportunities" element={<MatchedOpportunities />} />
        <Route path="/matched-edvestors" element={<MatchedEdVestors />} />
        <Route path="/admin-match-control" element={<AdminMatchControl />} />
        <Route path="/matching" element={<MatchingDashboard />} />
        <Route path="/xschetails" element={<Xschetails />} />
        <Route path="/xschetails/dashboard" element={<XschetailsDashboard />} />
        <Route path="/my-xschool" element={<MyXschool />} />
        <Route path="/notifications" element={<NotificationPrefs />} />
        <Route path="/admin/enterprise" element={<AdminEnterprise />} />
        <Route path="/admin/feedback" element={<AdminFeedback />} />
      </Route>

      {/* TubedX */}
      <Route path="/tubedx" element={<TubedXHome />} />
      <Route element={<AppLayout />}>
        <Route path="/tubedx/dashboard" element={<TubedXDashboard />} />
        <Route path="/tubedx/videos" element={<TubedXVideos />} />
        <Route path="/tubedx/events" element={<TubedXEvents />} />
        <Route path="/tubedx/analytics" element={<TubedXAnalytics />} />
        <Route path="/tubedx/ai-studio" element={<TubedXAIStudio />} />
        <Route path="/tubedx/ott" element={<TubedXOTT />} />
      </Route>

      {/* OneJob */}
      <Route path="/onejob" element={<OneJobHome />} />
      <Route element={<AppLayout />}>
        <Route path="/onejob/jobs" element={<JobBoard />} />
        <Route path="/onejob/employer" element={<EmployerDashboard />} />
        <Route path="/onejob/post" element={<PostJob />} />
        <Route path="/onejob/seeker" element={<JobSeekerDashboard />} />
        <Route path="/onejob/pricing" element={<OneJobPricing />} />
        <Route path="/onejob/admin" element={<OneJobAdmin />} />
      </Route>

      {/* edXportante */}
      <Route path="/edxportante" element={<EdXportanteHome />} />
      <Route element={<AppLayout />}>
        <Route path="/edxportante/generate" element={<ContentGenerator />} />
        <Route path="/edxportante/marketplace" element={<ContentMarketplace />} />
        <Route path="/edxportante/dashboard" element={<EdXportanteDashboard />} />
      </Route>

      {/* TwotrX standalone entry */}
      <Route path="/twotrx" element={<TwotrXHome />} />

      {/* TwotrX School Portal */}
      <Route element={<TwotrXLayout userRole="school" />}>
        <Route path="/twotrx/school" element={<SchoolDashboard />} />
        <Route path="/twotrx/refer-student" element={<ReferStudent />} />
        <Route path="/twotrx/students" element={<StudentReferrals />} />
        <Route path="/twotrx/tutors" element={<TutorMarketplace />} />
        <Route path="/twotrx/billing" element={<SchoolDashboard />} />
        <Route path="/twotrx/reports" element={<SchoolDashboard />} />
        <Route path="/twotrx/sessions" element={<SchoolDashboard />} />
      </Route>

      {/* TwotrX Parent Portal */}
      <Route element={<TwotrXLayout userRole="parent" />}>
        <Route path="/twotrx/parent" element={<ParentDashboard />} />
        <Route path="/twotrx/my-student" element={<StudentReferrals />} />
        <Route path="/twotrx/payments" element={<ParentDashboard />} />
        <Route path="/twotrx/progress" element={<ParentDashboard />} />
      </Route>

      {/* TwotrX Tutor Portal */}
      <Route element={<TwotrXLayout userRole="tutor" />}>
        <Route path="/twotrx/tutor" element={<TutorDashboard />} />
        <Route path="/twotrx/apply" element={<TutorApply />} />
        <Route path="/twotrx/requests" element={<TutorRequests />} />
        <Route path="/twotrx/calendar" element={<TutorDashboard />} />
        <Route path="/twotrx/my-students" element={<StudentReferrals />} />
        <Route path="/twotrx/session-notes" element={<TutorDashboard />} />
        <Route path="/twotrx/earnings" element={<TutorDashboard />} />
      </Route>

      {/* TwotrX Admin Portal */}
      <Route element={<TwotrXLayout userRole="admin" />}>
        <Route path="/twotrx/admin" element={<TwotrXAdminDashboard />} />
        <Route path="/twotrx/admin/tutors" element={<TwotrXAdminDashboard />} />
        <Route path="/twotrx/admin/referrals" element={<StudentReferrals />} />
        <Route path="/twotrx/admin/sessions" element={<TwotrXAdminDashboard />} />
        <Route path="/twotrx/admin/payments" element={<TwotrXAdminDashboard />} />
        <Route path="/twotrx/admin/reports" element={<TwotrXAdminDashboard />} />
      </Route>
      {/* Xschores */}
      <Route path="/xschores/home" element={<XschoresHome />} />
      <Route element={<XschoresLayout />}>
        <Route path="/xschores" element={<XschoresDashboard />} />
        <Route path="/xschores/students" element={<XschoresStudents />} />
        <Route path="/xschores/alerts" element={<XschoresAlerts />} />
        <Route path="/xschores/benchmarks" element={<XschoresBenchmarks />} />
        <Route path="/xschores/culture" element={<XschoresCultureLog />} />
        <Route path="/xschores/reports" element={<XschoresReports />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
    </>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
          <PlatformChatbot />
          <AskEddy />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App