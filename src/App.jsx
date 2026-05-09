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
import Billing from './pages/Billing';
import IdentityVerification from './pages/IdentityVerification';
import AdminEnterprise from './pages/AdminEnterprise';
import TubedXHome from './pages/tubedx/TubedXHome';
import TubedXDashboard from './pages/tubedx/TubedXDashboard';
import TubedXVideos from './pages/tubedx/TubedXVideos';
import TubedXEvents from './pages/tubedx/TubedXEvents';
import TubedXAnalytics from './pages/tubedx/TubedXAnalytics';
import TubedXAIStudio from './pages/tubedx/TubedXAIStudio';
import TubedXOTT from './pages/tubedx/TubedXOTT';
import OnboardingFlow from './components/platform/OnboardingFlow';
import TiliiHome from './pages/tilii/TiliiHome';
import TiliiLayout from './pages/tilii/TiliiLayout';
import TiliiGate from './pages/tilii/TiliiGate';
import TiliiDiscover from './pages/tilii/TiliiDiscover';
import TiliiWatch from './pages/tilii/TiliiWatch';
import TiliiStudio from './pages/tilii/TiliiStudio';
import WhalleDohHome from './pages/whalledoh/WhalleDohHome';
import WhalleDohDiscover from './pages/whalledoh/WhalleDohDiscover';
import WhalleDohAI from './pages/whalledoh/WhalleDohAI';
import WhalleDohCommunities from './pages/whalledoh/WhalleDohCommunities';
import WhalleDohProfile from './pages/whalledoh/WhalleDohProfile';
import WhalleDohGate from './pages/whalledoh/WhalleDohGate';
import XschoresHome from './pages/xschores/XschoresHome';
import XschoresLayout from './components/xschores/XschoresLayout';
import XschoresDashboard from './pages/xschores/XschoresDashboard';
import XschoresStudents from './pages/xschores/XschoresStudents';
import XschoresAlerts from './pages/xschores/XschoresAlerts';
import XschoresBenchmarks from './pages/xschores/XschoresBenchmarks';
import XschoresCultureLog from './pages/xschores/XschoresCultureLog';
import XschoresReports from './pages/xschores/XschoresReports';
import { AnimatePresence } from 'framer-motion';
import PaymentsDashboard from './pages/admin/PaymentsDashboard';
import ExecutiveDashboard from './pages/admin/ExecutiveDashboard';
import XschyXschraiper from './pages/XschyXschraiper';
import GoaledXschoolHome from './pages/goaledxschool/GoaledXschoolHome';
import MyXschoolPage from './pages/goaledxschool/MyXschoolPage';
import XschInfoPage from './pages/goaledxschool/XschInfoPage';
import MasterXschedulePage from './pages/goaledxschool/MasterXschedulePage';
import XschmartGoalxPage from './pages/goaledxschool/XschmartGoalxPage';
import PerformintxPage from './pages/goaledxschool/PerformintxPage';
import MasterCalendarPage from './pages/goaledxschool/MasterCalendarPage';
import GoaledScoresPage from './pages/goaledxschool/GoaledScoresPage';
import DaidaBaixedHome from './pages/daidabaixed/DaidaBaixedHome';
import DaidaLayout from './components/daidabaixed/DaidaLayout';
import DaidaCommandCenter from './pages/daidabaixed/DaidaCommandCenter';
import DaidaAcademic from './pages/daidabaixed/DaidaAcademic';
import DaidaSpedCommand from './pages/daidabaixed/DaidaSpedCommand';
import DaidaAlerts from './pages/daidabaixed/DaidaAlerts';
import DaidaReports from './pages/daidabaixed/DaidaReports';
import DaidaGoals from './pages/daidabaixed/DaidaGoals';
import DaidaAIForecast from './pages/daidabaixed/DaidaAIForecast';
import PerSpEdxtivesHome from './pages/perspedxtives/PerSpEdxtivesHome';
import PerSpEdxtivesDashboard from './pages/perspedxtives/PerSpEdxtivesDashboard';
import SpedStudents from './pages/perspedxtives/SpedStudents';
import SpedIEPManager from './pages/perspedxtives/SpedIEPManager';
import SpedGoals from './pages/perspedxtives/SpedGoals';
import SpedServices from './pages/perspedxtives/SpedServices';
import SpedSchedule from './pages/perspedxtives/SpedSchedule';
import SpedMeetings from './pages/perspedxtives/SpedMeetings';
import SpedCompliance from './pages/perspedxtives/SpedCompliance';
import SpedAIGenerator from './pages/perspedxtives/SpedAIGenerator';
import PerSpEdxtivesLayout from './components/perspedxtives/PerSpEdxtivesLayout';
import GraiedxHome from './pages/graiedx/GraiedxHome';
import GraiedxLayout from './components/graiedx/GraiedxLayout';
import GraiedxDashboard from './pages/graiedx/GraiedxDashboard';
import GraiedxGradebook from './pages/graiedx/GraiedxGradebook';
import GraiedxAssignments from './pages/graiedx/GraiedxAssignments';
import GraiedxStudents from './pages/graiedx/GraiedxStudents';
import GraiedxVoiceGrading from './pages/graiedx/GraiedxVoiceGrading';
import GraiedxReports from './pages/graiedx/GraiedxReports';
import GraiedxAnalytics from './pages/graiedx/GraiedxAnalytics';
import GraiedxAlerts from './pages/graiedx/GraiedxAlerts';
import GraiedxStandards from './pages/graiedx/GraiedxStandards';
import GraiedxFamily from './pages/graiedx/GraiedxFamily';
import GraiedxPaiy from './pages/graiedx/GraiedxPaiy';
import GraiedxPaiyStudent from './pages/graiedx/GraiedxPaiyStudent';
import GraiedxPaiyTeacher from './pages/graiedx/GraiedxPaiyTeacher';
import FoundaitionxHome from './pages/foundaitionx/FoundaitionxHome';
import FoundaitionxLayout from './components/foundaitionx/FoundaitionxLayout';
import FoundaitionxBuilder from './pages/foundaitionx/FoundaitionxBuilder';
import FoundaitionxApplication from './pages/foundaitionx/FoundaitionxApplication';
import FoundaitionxBoaredX from './pages/foundaitionx/FoundaitionxBoaredX';
import FoundaitionxDocuments from './pages/foundaitionx/FoundaitionxDocuments';
import FoundaitionxFinance from './pages/foundaitionx/FoundaitionxFinance';
import FoundaitionxAcademic from './pages/foundaitionx/FoundaitionxAcademic';
import FoundaitionxCompliance from './pages/foundaitionx/FoundaitionxCompliance';
import FoundaitionxGovernance from './pages/foundaitionx/FoundaitionxGovernance';
import FoundaitionxBoardTracker from './pages/foundaitionx/FoundaitionxBoardTracker';
import FoundaitionxOperations from './pages/foundaitionx/FoundaitionxOperations';
import FoundaitionxStrategy from './pages/foundaitionx/FoundaitionxStrategy';
import EduCartxHome from './pages/educartx/EduCartxHome';
import EduCartxLayout from './components/educartx/EduCartxLayout';
import EduCartxMarketplace from './pages/educartx/EduCartxMarketplace';
import EduCartxStorefront from './pages/educartx/EduCartxStorefront';
import EduCartxProducts from './pages/educartx/EduCartxProducts';
import EduCartxDashboard from './pages/educartx/EduCartxDashboard';
import EduCartxOrders from './pages/educartx/EduCartxOrders';
import EduCartxAICoach from './pages/educartx/EduCartxAICoach';
import CEOCommandCenter from './pages/CEOCommandCenter';
import ClassifiedxHome from './pages/classifiedx/ClassifiedxHome';
import ClassifiedxLayout from './components/classifiedx/ClassifiedxLayout';
import ClassifiedxBuilder from './pages/classifiedx/ClassifiedxBuilder';
import ClassifiedxStudio from './pages/classifiedx/ClassifiedxStudio';
import ClassifiedxSyllabus from './pages/classifiedx/ClassifiedxSyllabus';
import ClassifiedxCourses from './pages/classifiedx/ClassifiedxCourses';
import ClassifiedxAssessments from './pages/classifiedx/ClassifiedxAssessments';
import ClassifiedxAnalytics from './pages/classifiedx/ClassifiedxAnalytics';
import ClassifiedxLMS from './pages/classifiedx/ClassifiedxLMS';
import ClassifiedxPublish from './pages/classifiedx/ClassifiedxPublish';

const ONBOARDING_KEY = 'edx_onboarding_complete';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const [showOnboarding, setShowOnboarding] = React.useState(false);

  React.useEffect(() => {
    if (!localStorage.getItem(ONBOARDING_KEY)) {
      setTimeout(() => setShowOnboarding(true), 600);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setShowOnboarding(false);
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
        <Route path="/billing" element={<Billing />} />
        <Route path="/identity-verification" element={<IdentityVerification />} />
        <Route path="/admin/enterprise" element={<AdminEnterprise />} />
        <Route path="/admin/feedback" element={<AdminFeedback />} />
        <Route path="/admin/payments" element={<PaymentsDashboard />} />
        <Route path="/admin/executive" element={<ExecutiveDashboard />} />
        <Route path="/xschy" element={<XschyXschraiper />} />
        <Route path="/goaled" element={<GoaledXschoolHome />} />
        <Route path="/goaled/my-xschool" element={<MyXschoolPage />} />
        <Route path="/goaled/xschinfo" element={<XschInfoPage />} />
        <Route path="/goaled/master-xschedule" element={<MasterXschedulePage />} />
        <Route path="/goaled/xschmart-goalx" element={<XschmartGoalxPage />} />
        <Route path="/goaled/performintx" element={<PerformintxPage />} />
        <Route path="/goaled/master-calendar" element={<MasterCalendarPage />} />
        <Route path="/goaled/scores" element={<GoaledScoresPage />} />
      </Route>

      {/* Graiedx™ */}
      <Route path="/graiedx/home" element={<GraiedxHome />} />
      <Route element={<GraiedxLayout />}>
        <Route path="/graiedx" element={<GraiedxDashboard />} />
        <Route path="/graiedx/gradebook" element={<GraiedxGradebook />} />
        <Route path="/graiedx/assignments" element={<GraiedxAssignments />} />
        <Route path="/graiedx/students" element={<GraiedxStudents />} />
        <Route path="/graiedx/voice" element={<GraiedxVoiceGrading />} />
        <Route path="/graiedx/reports" element={<GraiedxReports />} />
        <Route path="/graiedx/analytics" element={<GraiedxAnalytics />} />
        <Route path="/graiedx/alerts" element={<GraiedxAlerts />} />
        <Route path="/graiedx/standards" element={<GraiedxStandards />} />
        <Route path="/graiedx/family" element={<GraiedxFamily />} />
        <Route path="/graiedx/paiy" element={<GraiedxPaiy />} />
        <Route path="/graiedx/paiy-student" element={<GraiedxPaiyStudent />} />
        <Route path="/graiedx/paiy-teacher" element={<GraiedxPaiyTeacher />} />
      </Route>

      {/* Foundaitionx™ */}
      <Route path="/foundaitionx/home" element={<FoundaitionxHome />} />
      <Route element={<FoundaitionxLayout />}>
        <Route path="/foundaitionx/builder" element={<FoundaitionxBuilder />} />
        <Route path="/foundaitionx/application" element={<FoundaitionxApplication />} />
        <Route path="/foundaitionx/boaredx" element={<FoundaitionxBoaredX />} />
        <Route path="/foundaitionx/documents" element={<FoundaitionxDocuments />} />
        <Route path="/foundaitionx/finance" element={<FoundaitionxFinance />} />
        <Route path="/foundaitionx/academic" element={<FoundaitionxAcademic />} />
        <Route path="/foundaitionx/compliance" element={<FoundaitionxCompliance />} />
        <Route path="/foundaitionx/governance" element={<FoundaitionxGovernance />} />
        <Route path="/foundaitionx/board-tracker" element={<FoundaitionxBoardTracker />} />
        <Route path="/foundaitionx/operations" element={<FoundaitionxOperations />} />
        <Route path="/foundaitionx/strategy" element={<FoundaitionxStrategy />} />
      </Route>

      {/* Classifiedx™ */}
      <Route path="/classifiedx/home" element={<ClassifiedxHome />} />
      <Route element={<ClassifiedxLayout />}>
        <Route path="/classifiedx/builder" element={<ClassifiedxBuilder />} />
        <Route path="/classifiedx/studio" element={<ClassifiedxStudio />} />
        <Route path="/classifiedx/syllabus" element={<ClassifiedxSyllabus />} />
        <Route path="/classifiedx/courses" element={<ClassifiedxCourses />} />
        <Route path="/classifiedx/assessments" element={<ClassifiedxAssessments />} />
        <Route path="/classifiedx/analytics" element={<ClassifiedxAnalytics />} />
        <Route path="/classifiedx/lms" element={<ClassifiedxLMS />} />
        <Route path="/classifiedx/publish" element={<ClassifiedxPublish />} />
      </Route>

      {/* Daida Baixed™ */}
      <Route path="/daida-baixed/home" element={<DaidaBaixedHome />} />
      <Route element={<DaidaLayout />}>
        <Route path="/daida-baixed" element={<DaidaCommandCenter />} />
        <Route path="/daida-baixed/academic" element={<DaidaAcademic />} />
        <Route path="/daida-baixed/sped" element={<DaidaSpedCommand />} />
        <Route path="/daida-baixed/alerts" element={<DaidaAlerts />} />
        <Route path="/daida-baixed/reports" element={<DaidaReports />} />
        <Route path="/daida-baixed/goals" element={<DaidaGoals />} />
        <Route path="/daida-baixed/ai-forecast" element={<DaidaAIForecast />} />
      </Route>

      {/* PerSpEdxtives™ */}
      <Route path="/perspedxtives/home" element={<PerSpEdxtivesHome />} />
      <Route element={<PerSpEdxtivesLayout />}>
        <Route path="/perspedxtives" element={<PerSpEdxtivesDashboard />} />
        <Route path="/perspedxtives/students" element={<SpedStudents />} />
        <Route path="/perspedxtives/ieps" element={<SpedIEPManager />} />
        <Route path="/perspedxtives/goals" element={<SpedGoals />} />
        <Route path="/perspedxtives/services" element={<SpedServices />} />
        <Route path="/perspedxtives/schedule" element={<SpedSchedule />} />
        <Route path="/perspedxtives/meetings" element={<SpedMeetings />} />
        <Route path="/perspedxtives/compliance" element={<SpedCompliance />} />
        <Route path="/perspedxtives/ai-generator" element={<SpedAIGenerator />} />
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

      {/* TiliiVisxion */}
      <Route path="/tilii" element={<TiliiHome />} />
      <Route element={<TiliiLayout />}>
        <Route path="/tilii/discover" element={<TiliiGate><TiliiDiscover /></TiliiGate>} />
        <Route path="/tilii/watch" element={<TiliiGate><TiliiWatch /></TiliiGate>} />
        <Route path="/tilii/studio" element={<TiliiGate><TiliiStudio /></TiliiGate>} />
        <Route path="/tilii/channels" element={<TiliiGate><TiliiDiscover /></TiliiGate>} />
        <Route path="/tilii/live" element={<TiliiGate><TiliiDiscover /></TiliiGate>} />
        <Route path="/tilii/masterclasses" element={<TiliiGate><TiliiDiscover /></TiliiGate>} />
      </Route>

      {/* EduCartx™ */}
      <Route path="/educartx" element={<EduCartxHome />} />
      <Route element={<EduCartxLayout />}>
        <Route path="/educartx/marketplace" element={<EduCartxMarketplace />} />
        <Route path="/educartx/storefront" element={<EduCartxStorefront />} />
        <Route path="/educartx/products" element={<EduCartxProducts />} />
        <Route path="/educartx/dashboard" element={<EduCartxDashboard />} />
        <Route path="/educartx/orders" element={<EduCartxOrders />} />
        <Route path="/educartx/ai-coach" element={<EduCartxAICoach />} />
      </Route>

      {/* WhalleDoh — public landing, gated inner pages */}
      <Route path="/whalledoh" element={<WhalleDohHome />} />
      <Route path="/whalledoh/discover" element={<WhalleDohGate><WhalleDohDiscover /></WhalleDohGate>} />
      <Route path="/whalledoh/ai" element={<WhalleDohGate><WhalleDohAI /></WhalleDohGate>} />
      <Route path="/whalledoh/communities" element={<WhalleDohGate><WhalleDohCommunities /></WhalleDohGate>} />
      <Route path="/whalledoh/profiles" element={<WhalleDohGate><WhalleDohProfile /></WhalleDohGate>} />

      <Route path="/ceo-command" element={<CEOCommandCenter />} />
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