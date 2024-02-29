
import {  Route, BrowserRouter as Router, Routes } from "react-router-dom"
// import Analytics from "./Analytics"
// import AuthRedirect from "./components/AuthRedirect"
// import ContactAndSupport from "./components/ContactAndSupport"
// import Home from "./Home"
// import Policy from "./Policy"
// import SignIn from "./SignIn"
// import TermsAndConditions from "./TermsAndConditions"
// import WebApp from "./WebApp"
import { AnimatePresence } from 'framer-motion';
import { lazy } from "react"
// import Payment from "./components/Payment";


// Marking all compoenents as lazy (load on request only - no_preload) to save the bandwidth along with privacy terms 😜
const LazyTermsAndConditions = lazy(() => import('./TermsAndConditions'));
const LazyPolicy = lazy(() => import('./Policy'));
// const LazyReturnPolicy = lazy(() => import('./'))
const LazyContactAndSupport = lazy(() => import('./components/ContactAndSupport'));
const LazyAuthRedirect = lazy(() => import('./components/AuthRedirect'));
// const LazyUnlockAnalytics = lazy(() => import('./UnlockAnalytics'));
const LazyUnlockAnalytics = lazy(() => import('./UnlockAnalyticsNew'));
const LazyHome = lazy(() => import('./Home'));
const LazySignIn = lazy(() => import('./SignIn'));
const LazyWebApp = lazy(() => import('./WebApp'));
const LazyAnalytics = lazy(() => import('./Analytics'));
const LazyDocs = lazy(() => import('./Docs'))
const LazyProfileView = lazy(() => import('./components/ProfileView'))


export default function App() {

  return (
      <AnimatePresence mode='wait' >
        <Routes>
          <Route path="/docs/terms_and_conditions" element={<LazyTermsAndConditions />} />
          <Route path="/docs/policy" element={<LazyPolicy />} />
          <Route path="/contact" element={<LazyContactAndSupport />} /><Route path="/support" element={<LazyContactAndSupport />} />
          <Route path="/auth/redirect/" element={<LazyAuthRedirect />} />
          <Route path="/" element={<LazyHome/>} />
          <Route path="/signin" element={<LazySignIn/>} /> 
          <Route path="/web/profile/:profile_id" element={<LazyProfileView />} />
          <Route path="/web" element={<LazyWebApp />} />
          <Route path="/analytics" element={<LazyAnalytics />} />
          <Route path="/docs/*" element={<LazyDocs />} />
          {/* <Route path="/unlock_analytics" element={<LazyUnlockAnalytics />} /> */}
          <Route path="/unlock_analytics" element={<LazyUnlockAnalytics />} />
        </Routes>
      </AnimatePresence>
  )

}
