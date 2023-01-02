
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Home from "./Home"
import TermsAndConditions from "./TermsAndConditions"
export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/terms_and_conditions" element={<TermsAndConditions />} />
        <Route path="/" element={<Home/>} />
      </Routes>
    </Router>
  )

}
